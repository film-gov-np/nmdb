using FastEndpoints;
using Core;
using Infrastructure.Data;
using Core.Constants;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Dtos.Film;

namespace nmdb.Endpoints.Films.FilmRoleCategory
{
    public class GetById(IFilmRoleCategoryService filmRoleCategoryService)
        : Endpoint<GetFilmRoleCategoryByIdRequest, ApiResponse<FilmRoleCategoryDto>>
    {
        public override void Configure()
        {
            Get(GetFilmRoleCategoryByIdRequest.Route) ;
            Roles(AuthorizationConstants.AdminRole);            
        }

        public override async Task HandleAsync(GetFilmRoleCategoryByIdRequest request,
          CancellationToken cancellationToken)
        {
            var result = await filmRoleCategoryService.GetById(request.RoleCategoryId);
            Response = result;// new FilmRoleCategoryResponse(result.Data.Id, result.CategoryName, result.DisplayOrder);            
        }
    }
}
