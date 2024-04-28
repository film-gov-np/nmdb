using Application.Dtos.Auth;
using Core;
using Core.Constants;
using FastEndpoints;
using Infrastructure.Identity.Services;
using System.Net;

namespace nmdb.Endpoints.AuthEndpoints;

public class Authenticate
    : Endpoint<AuthenticateRequest, ApiResponse<AuthenticateResponse>>
{
    private readonly IAuthService _authService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public Authenticate(IAuthService authService, IHttpContextAccessor contextAccessor)
    {
        _authService = authService;
        _httpContextAccessor = contextAccessor;
    }    
    public override void Configure()
    {
        Post(AuthenticateRequest.Route);
        AllowAnonymous();

        Summary(s =>
        {            
            s.Summary = "Authenticate API";
            s.Description = "Returns jwt token.";
            s.ExampleRequest = new AuthenticateRequest { Email = "admin@nmdb.com", Password = "Hello@123" };
        });
    }

    public override async Task HandleAsync(AuthenticateRequest request,
        CancellationToken cancellationToken)

    {
        try
        {
            var authenticateResponse = await _authService.Authenticate(request, "");
            setTokenCookie(authenticateResponse.JwtToken, authenticateResponse.RefreshToken);
            Response = ApiResponse<AuthenticateResponse>.SuccessResponse(authenticateResponse, "User authenticated successfully.");
        }
        catch (UnauthorizedAccessException ex)
        {
            Response = ApiResponse<AuthenticateResponse>.ErrorResponse(ex.Message, HttpStatusCode.Unauthorized);
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

