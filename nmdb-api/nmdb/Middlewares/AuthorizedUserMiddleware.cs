using Application.Dtos;
using Core.Constants;
using Core;
using Infrastructure.Identity.Security.TokenGenerator;
using Infrastructure.Identity.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.Net;
using System.Security.Claims;

namespace nmdb.Middlewares;

public class AuthorizedUserMiddleware : IMiddleware
{
    private readonly IAuthService _usrAuth;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthorizedUserMiddleware(IAuthService usrAuth, IJwtTokenGenerator jwtTokenGenerator)
    {
        _usrAuth = usrAuth;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.Request.Headers.ContainsKey("Authorization"))
        {
            string accessToken = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(accessToken))
            {
                if (!_jwtTokenGenerator.IsTokenExpired(accessToken))
                {                    
                    ClaimsPrincipal claimPrincipal = _jwtTokenGenerator.GetClaimsPrincipalFromToken(accessToken);
                    if (claimPrincipal != null)
                    {
                        ClaimsIdentity claimsIdentity = (ClaimsIdentity)claimPrincipal.Identity;
                        CurrentUser user = _usrAuth.GetUserFromClaims(claimsIdentity.Claims);
                        context.Items["CurrentUser"] = user;

                        // Call the next middleware in the pipeline or the endpoint handler
                        await next(context);
                        return;
                    }
                    else
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.NotAcceptable;
                        await context.Response.WriteAsync("Invalid Access Token.");
                        return;
                    }
                }
            }

            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsync("Unauthorized");
        }
        else
        {
            // Skip authentication middleware for anonymous requests
            await next(context);
        }
    }
}
