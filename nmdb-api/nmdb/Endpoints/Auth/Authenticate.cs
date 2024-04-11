using Application.Dtos.Auth;
using Core;
using FastEndpoints;
using Infrastructure.Identity.Services;
using System.Net;

namespace nmdb.Endpoints.AuthEndpoints;

public class Authenticate
    : Endpoint<AuthenticateRequest, ApiResponse<AuthenticateResponse>>
{
    private readonly IAuthService _authService;
    public Authenticate(IAuthService authService)
    {
        _authService = authService;
    }
    private const string Route = "api/auth/authenticate";
    public override void Configure()
    {
        Post(AuthenticateRequest.Route);
        AllowAnonymous();

        Summary(s =>
        {
            // XML Docs are used by default but are overridden by these properties:
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
            Response = ApiResponse<AuthenticateResponse>.SuccessResponse(authenticateResponse, "User authenticated successfully.");
        }
        catch (UnauthorizedAccessException ex)
        {
            Response = ApiResponse<AuthenticateResponse>.ErrorResponse(ex.Message, HttpStatusCode.Unauthorized);
        }
    }
}

