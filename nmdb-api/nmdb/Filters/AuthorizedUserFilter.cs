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
        //string accessToken = context.HttpContext.Request.Cookies["accessToken"];
        // string refreshToken = context.HttpContext.Request.Cookies["refreshToken"];

        string accessToken = context.HttpContext.Request?.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
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
                }
                else
                {
                    context.Result = new UnauthorizedObjectResult(ApiResponse<string>.ErrorResponse("Invalid Access Token.", HttpStatusCode.NotAcceptable));
                }
            }
        }
        else            
            context.Result = new UnauthorizedObjectResult(ApiResponse<string>.ErrorResponse(MessageConstants.Unauthorized, HttpStatusCode.Unauthorized));
    }
}
