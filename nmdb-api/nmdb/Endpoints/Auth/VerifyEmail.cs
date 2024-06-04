using Application.Models;
using Infrastructure.Identity.Services;
using FastEndpoints;
using Core;

namespace nmdb.Endpoints.Auth;

public class VerifyEmail
    : EndpointWithoutRequest<ApiResponse<string>>
{
    private readonly IAuthService _authService;
    public VerifyEmail(IAuthService authService)
    {
        _authService = authService;
    }
    public override void Configure()
    {
        Post("api/auth/{token}/verify-email/");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        try
        {
            string token = Route<string>("token");
            await _authService.VerifyEmail(token);
            Response = ApiResponse<string>.SuccessResponse("Your email has been verified successfully.");
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
