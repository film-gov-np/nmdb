using Application.Dtos.Auth;
using Azure;
using Azure.Core;
using Core;
using Core.Constants;
using FastEndpoints;
using Infrastructure.Identity.Services;
using System.Net;

namespace nmdb.Endpoints.Auth;

public class RefreshToken
    : Endpoint<RefreshTokenRequest, ApiResponse<AuthenticateResponse>>
{
    private readonly IAuthService _authService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public RefreshToken(IAuthService authService, IHttpContextAccessor contextAccessor)
    {
        _authService = authService;
        _httpContextAccessor = contextAccessor;
    }
    public override void Configure()
    {
        Post(RefreshTokenRequest.Route);
        AllowAnonymous();

        Summary(s =>
        {
            s.Summary = "Refresh Token API";
            s.Description = "Refresh Jwt Token and return it.";
            s.ExampleRequest = new RefreshTokenRequest("hastalavista@123JuggerNutBustYourAss");
        });
    }

    public override async Task HandleAsync(RefreshTokenRequest refreshTokenRequest,
        CancellationToken cancellationToken)

    {
        try
        {
            string refreshToken = refreshTokenRequest.RefreshToken;
            var _httpContextRequest = _httpContextAccessor.HttpContext.Request;

            if (string.IsNullOrEmpty(refreshToken))
            {
                refreshToken = _httpContextRequest.Cookies[TokenConstants.RefreshToken];
            }

            if (string.IsNullOrEmpty(refreshToken))
            {
                Response = ApiResponse<AuthenticateResponse>.ErrorResponse("No refresh token was provided.");

            }

            var refreshTokenResponse = await _authService.RefreshToken(refreshToken, "");

            setTokenCookie(refreshTokenResponse.JwtToken, refreshTokenResponse.RefreshToken);

            await SendOkAsync(ApiResponse<AuthenticateResponse>.SuccessResponse(refreshTokenResponse, "Token refreshed successfully."));
        }
        catch (Exception ex)
        {
            // Log errrors
            await SendAsync(ApiResponse<AuthenticateResponse>
                .ErrorResponse(ex.Message
                , HttpStatusCode.Unauthorized),
                (int)HttpStatusCode.Unauthorized, cancellationToken);
        }
    }
    private void setTokenCookie(string accessToken, string refreshToken = "")
    {
        // append cookie with refresh token to the http response
        //var cookieOptions = new CookieOptions
        //{
        //    HttpOnly = true,
        //    Expires = DateTime.UtcNow.AddDays(7),
        //    SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
        //    Secure = true,

        //};
        //_httpContextAccessor.HttpContext.Response.Cookies.Append(TokenConstants.RefreshToken, refreshToken, cookieOptions);

        var cookieOptions = new CookieOptions()
        {
            HttpOnly = true,
            Secure = true,
            Expires = DateTime.UtcNow.AddDays(2),
            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None
        };
        _httpContextAccessor.HttpContext.Response.Cookies.Append(TokenConstants.AccessToken, accessToken, cookieOptions);
    }
}