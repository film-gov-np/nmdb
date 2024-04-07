using Application.Interfaces;
using Application.Interfaces.Repositories;
using Core.Constants;
using FastEndpoints;
using Infrastructure.Data;
using Infrastructure.Identity;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace nmdb.Endpoints.Movies;

public class Create
    : Endpoint<CreateRequest, CreateResponse>
{
    private const string Route = "api/movies/create";
    private AppDbContext _appDbContext;

    public Create(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }
    public override void Configure()
    {
        Post(Route);
        Roles(AuthorizationConstants.AdminRole);
        Summary(s =>
        {
            s.ExampleRequest = new CreateRequest("The Lion King", true);
        });

    }

    public override async Task HandleAsync(CreateRequest request,
        CancellationToken cancellationToken)
    {
        // Call movie service to create new movie
        //var user = User.
        Response = new CreateResponse("Movie created successfully.");
        return;
    }
}