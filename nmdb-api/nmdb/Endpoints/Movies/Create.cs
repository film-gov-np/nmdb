using Application.Interfaces;
using Application.Interfaces.Repositories;
using Core.Constants;
using FastEndpoints;
using Infrastructure.Data;
using Infrastructure.Identity;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace nmdb.Endpoints.Movies;

public class Create
    : Endpoint<CreateRequest, CreateResponse>
{
    private const string Route = "api/movies/create";
    private AppDbContext _appDbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public Create(AppDbContext appDbContext, IHttpContextAccessor httpContextAccessor)
    {
        _appDbContext = appDbContext;
        _httpContextAccessor = httpContextAccessor; 
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
        ClaimsIdentity user = (ClaimsIdentity)_httpContextAccessor.HttpContext.User.Identity;
        Response = new CreateResponse("Movie created successfully.");
        return;
    }
}