using FastEndpoints;
using Core;
using Infrastructure.Data;
using Core.Constants;
using Application.Interfaces;

namespace nmdb.Endpoints.Films.FilmRoleCategory
{
    public class GetById(IUnitOfWork _unitOfWork)
        : Endpoint<GetFilmRoleCategoryByIdRequest, FilmRoleCategoryResponse>
    {
        public override void Configure()
        {
            Get(GetFilmRoleCategoryByIdRequest.Route) ;
            Roles(AuthorizationConstants.AdminRole);            
        }

        public override async Task HandleAsync(GetFilmRoleCategoryByIdRequest request,
          CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.FilmRoleCategoryRepository.GetByIdAsync(request.RoleCategoryId);
            Response = new FilmRoleCategoryResponse(result.Id, result.CategoryName, result.DisplayOrder);            
        }
    }
}
