using Application.Dtos.Auth;
using Core;
using FastEndpoints;
using Infrastructure.Identity.Services;

namespace nmdb.Endpoints.AuthEndpoints;

public class RegisterCrew
    : Endpoint<RegisterRequest, ApiResponse<string>>
{
    private readonly IAuthService _authService;
    public RegisterCrew(IAuthService authService)
    {
        _authService = authService;
    }
    public override void Configure()
    {
        Post("api/auth/register-crew");
        AllowAnonymous();

        Summary(s =>
        {
            s.ExampleRequest = new RegisterRequest { Email = "crew@nmdb.com", Password = "Crew@123", ConfirmPassword = "Crew@123" };
        });
    }

    public override async Task HandleAsync(RegisterRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
           var registerResponse = await _authService.RegisterCrew(request);
            Response = registerResponse;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}