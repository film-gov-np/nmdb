using FastEndpoints;

namespace nmdb.AuthEndpoints;

public class Register
    : Endpoint<RegisterRequest, RegisterResponse>
{
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
        Response = new RegisterResponse($"You have been successfully registered to nmdb. Check your email, {request.Email} to verify your account.");
        return;
    }
}