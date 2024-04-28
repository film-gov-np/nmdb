using Application.Dtos.FilterParameters;
using Application.Interfaces.Services;
using Azure;
using Core.Constants;
using FastEndpoints;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YamlDotNet.Serialization.NamingConventions;

namespace nmdb.Endpoints.Users;

public class GetAll(UserManager<ApplicationUser> _userManager)
       : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("api/users");
        AllowAnonymous();
        Summary(s =>
        {
            //s.ExampleRequest = new FilmRoleFilterParameters
            //{
            //    PageNumber = 1,
            //    PageSize = 4,
            //    SearchKeyword = "Focus",
            //    SortColumn = "RoleName"
            //};
        });
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var users = _userManager.Users;
        Response = await users.ToListAsync(cancellationToken);
    }
}
