using Application.Dtos.Auth;
using Core;
using FastEndpoints;
using Infrastructure.Identity.Services;

namespace nmdb.Endpoints.AuthEndpoints;

public class Register
    : Endpoint<RegisterRequest, ApiResponse<string>>
{
    private readonly IAuthService _authService;
    public Register(IAuthService authService)
    {
        _authService = authService;
    }
    public override void Configure()
    {
        Post(RegisterRequest.Route);
        AllowAnonymous();
        
        Summary(s =>
        {
            // XML Docs are used by default but are overridden by these properties:
            //s.Summary = "Create a new Contributor.";
            //s.Description = "Create a new Contributor. A valid name is required.";
            s.ExampleRequest = new RegisterRequest { Email = "demo@user.com", Password = "User@123", ConfirmPassword = "User@123" };
        });
    }

    public override async Task HandleAsync(RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var registerResponse = await _authService.Register(request);
        Response = registerResponse;
    }
}