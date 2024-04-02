
using FastEndpoints;

namespace nmdb.AuthEndpoints;

public class Authenticate
    : Endpoint<AuthenticateRequest, AuthenticateResponse>
{
    public override void Configure()
    {
        Post(AuthenticateRequest.Route);
        AllowAnonymous();
        Summary(s =>
        {
            // XML Docs are used by default but are overridden by these properties:
            //s.Summary = "Create a new Contributor.";
            //s.Description = "Create a new Contributor. A valid name is required.";
            s.ExampleRequest = new AuthenticateRequest { Email = "demo@user.com", Password = "User@123" };
        });
    }

    public override async Task HandleAsync(AuthenticateRequest request,
        CancellationToken cancellationToken)
    {
        Response = new AuthenticateResponse("Hello you have successfully implemented fastendpoint.");
        return;
    }
}

