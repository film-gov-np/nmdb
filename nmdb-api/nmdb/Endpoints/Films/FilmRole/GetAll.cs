using Application.CQRS.FilmRoles.Queries.GetFilmRoleById;
using Application.CQRS.FilmRoles.Queries;
using Core.Constants;
using Core.Entities;
using FastEndpoints;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Application.Helpers.Response;
using Application.Interfaces.Services;
using Application.Dtos.FilterParameters;
using Microsoft.AspNetCore.Mvc;

namespace nmdb.Endpoints.Films.FilmRole
{
    public class GetAll(IFilmRoleService filmRoleService, AutoMapper.IMapper mapper)
        : Endpoint<FilmRoleFilterParameters>
    {
        public override void Configure()
        {
            Get(GetAllFilmRolesRequest.Route);
            Roles(AuthorizationConstants.AdminRole);
            Summary(s =>
            {
                s.ExampleRequest = new FilmRoleFilterParameters
                {
                    PageNumber = 1,
                    PageSize = 4,
                    SearchKeyword = "Focus",
                    SortColumn="RoleName"
                };
            });
        }

        public override async Task HandleAsync([FromQuery] FilmRoleFilterParameters request,
          CancellationToken cancellationToken)
        {
            var response = await filmRoleService.GetAll(request);
            Response = response;
        }
    }
}
