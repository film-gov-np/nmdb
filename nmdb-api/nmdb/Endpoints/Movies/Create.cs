using FastEndpoints;

namespace nmdb.Endpoints.Movies;

public class Create
    : Endpoint<CreateRequest, CreateResponse>
{
    private const string Route = "api/movies/create";

    public override void Configure()
    {
        Post(Route);
        Roles("Admin");
        Summary(s =>
        {
            s.ExampleRequest = new CreateRequest("The Lion King", true);
        });
        
    }

    public override async Task HandleAsync(CreateRequest request,
        CancellationToken cancellationToken)
    {
        // Call movie service to create new movie
        Response = new CreateResponse("Movie created successfully.");
        return;
    }
}