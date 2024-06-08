using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.Security.Claims;
using Infrastructure.Identity.Security.TokenGenerator;
using Application.Dtos;
using Core;
using Infrastructure.Identity.Services;
using System.Net;
using Core.Constants;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;

namespace nmdb.Filters;
public class AuthorizedUserFilter : IAsyncAuthorizationFilter
{
    private readonly IAuthService _usrAuth;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthorizedUserFilter(IAuthService usrAuth, IJwtTokenGenerator jwtTokenGenerator)
    {
        _usrAuth = usrAuth;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var controllerActionDescriptor = context.ActionDescriptor as ControllerActionDescriptor;

        if (controllerActionDescriptor != null)
        {
            var controllerAllowAnonymousAttribute = controllerActionDescriptor.ControllerTypeInfo.GetCustomAttribute<AllowAnonymousAttribute>();
            var actionAllowAnonymousAttribute = controllerActionDescriptor.MethodInfo.GetCustomAttribute<AllowAnonymousAttribute>();

            // Allow anonymous access, proceed with the request without further authorization checks
            if (controllerAllowAnonymousAttribute != null || actionAllowAnonymousAttribute != null)
            {
                return;
            }
        }

        string accessToken = context.HttpContext.Request.Cookies["accessToken"];

        if (string.IsNullOrEmpty(accessToken))
        {
            accessToken = !string.IsNullOrEmpty(accessToken) ? context.HttpContext.Request?.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "") : "";
        }

        if (!string.IsNullOrEmpty(accessToken))
        {
            if (!_jwtTokenGenerator.IsTokenExpired(accessToken))
            {
                ClaimsPrincipal claimPrincipal = _jwtTokenGenerator.GetClaimsPrincipalFromToken(accessToken);
                if (claimPrincipal != null)
                {
                    ClaimsIdentity claimsIdentity = claimPrincipal.Claims.FirstOrDefault().Subject;
                    CurrentUser user = _usrAuth.GetUserFromClaims(claimsIdentity.Claims);
                    context.HttpContext.Items["CurrentUser"] = user;

                    if (controllerActionDescriptor != null)
                    {
                        // Check if the controller has the RequiredRoles attribute
                        // RequiredRoles is used along with Authorize attribute 
                        var controllerAuthorizeAttribute = controllerActionDescriptor.ControllerTypeInfo.GetCustomAttribute<RequiredRolesAttribute>();

                        // Check if the action method has the CustomAuthorize attribute
                        var actionAuthorizeAttribute = controllerActionDescriptor.MethodInfo.GetCustomAttribute<RequiredRolesAttribute>();

                        if (controllerAuthorizeAttribute != null || actionAuthorizeAttribute != null)
                        {
                            // Combine roles from controller and action level attributes
                            string[] controllerRoles = controllerAuthorizeAttribute?.Roles ?? new string[0];
                            string[] actionRoles = actionAuthorizeAttribute?.Roles ?? new string[0];
                            string[] requiredRoles = controllerRoles.Concat(actionRoles).Distinct().ToArray();

                            string[] userRoles = user.Roles.Split(",");

                            bool isSuperuser = userRoles.Contains(AuthorizationConstants.SuperUserRole);

                            // Check if the user has any of the required roles
                            bool hasRequiredRole = requiredRoles.Any(role => userRoles.Contains(role.Trim())) || isSuperuser;

                            if (!hasRequiredRole)
                            {
                                // If user doesn't have the required role, return unauthorized response
                                context.Result = new UnauthorizedObjectResult(ApiResponse<string>.ErrorResponse("Unauthorized access. User does not have the required role.", HttpStatusCode.Forbidden));
                                return;
                            }
                        }
                    }
                }
                else 
                {
                    context.Result = new UnauthorizedObjectResult(ApiResponse<string>.ErrorResponse("Invalid Access Token.", HttpStatusCode.NotAcceptable));
                }
            }
            else // check for refresh token validity and refresh token if valid else remove the cookie
            {
                context.Result = new UnauthorizedObjectResult(ApiResponse<string>.ErrorResponse("Expired Access Token.", HttpStatusCode.NotAcceptable));
            }
        }
        else
        {
            context.Result = new UnauthorizedObjectResult(ApiResponse<string>.ErrorResponse("No access token found. Try loggin in again.", HttpStatusCode.NotFound));
        }
    }
}