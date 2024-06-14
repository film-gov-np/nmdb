using Application.Dtos.Auth;
using Core;
using Core.Constants;
using FastEndpoints;
using Infrastructure.Identity.Services;
using Microsoft.Extensions.Options;
using System.Net;

namespace nmdb.Endpoints.AuthEndpoints;

public class Logout
    : EndpointWithoutRequest<ApiResponse<string>>
{
    private readonly IAuthService _authService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public Logout(IAuthService authService, IHttpContextAccessor contextAccessor)
    {
        _authService = authService;
        _httpContextAccessor = contextAccessor;
    }
    public override void Configure()
    {
        Post("api/auth/logout");
        AllowAnonymous();
        Summary(s =>
        {
            s.Summary = "Logout API";            
        });
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)

    {
        try
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                Secure = true,

            };
            _httpContextAccessor?.HttpContext?.Response.Cookies.Delete(TokenConstants.AccessToken, cookieOptions);
            _httpContextAccessor?.HttpContext?.Response.Cookies.Delete(TokenConstants.RefreshToken, cookieOptions);

            Response = ApiResponse<string>.SuccessResponseWithoutData("User logged out successfully.");
        }
        catch (Exception ex)
        {
            Response = ApiResponse<string>.ErrorResponse(ex.Message, HttpStatusCode.InternalServerError);
        }
    }
}

