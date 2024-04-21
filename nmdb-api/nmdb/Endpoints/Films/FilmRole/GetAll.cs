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

namespace nmdb.Endpoints.Films.FilmRole
{
    public class GetAll(IUnitOfWork unitOfWork, AutoMapper.IMapper mapper)
        : Endpoint<GetAllFilmRolesRequest>
    {
        public override void Configure()
        {
            Get(GetAllFilmRolesRequest.Route);
            Roles(AuthorizationConstants.AdminRole);
            Summary(s =>
            {
                s.ExampleRequest = new GetAllFilmRolesRequest
                {
                    PageNumber = 1,
                    PageSize = 4,
                    SearchKeyword = "Focus"
                };
            });
        }

        public override async Task HandleAsync(GetAllFilmRolesRequest request,
          CancellationToken cancellationToken)
        {            
            var filmRolesQuery = unitOfWork.FilmRoleRepository.Get();
            var totalItems = await filmRolesQuery.CountAsync();
            var filmRoles = await filmRolesQuery
                                        .Include(g => g.RoleCategory)
                                        .OrderBy(fr => fr.RoleName)
                                        .Skip((request.PageNumber - 1) * request.PageSize)
                                        .Take(request.PageSize)
                                        .Select(fr => new FilmRoleResponse(
                                                        fr.Id,
                                                        fr.RoleName,
                                                        fr.RoleCategory != null ? fr.RoleCategory.CategoryName : null,
                                                        fr.DisplayOrder))
                                        .ToListAsync();
            
            var response = new PaginationResponse<FilmRoleResponse>
            {
                Items = filmRoles,
                TotalItems = totalItems,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            Response = response;
        }
    }
}
