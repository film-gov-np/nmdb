
using Application.Interfaces;
using Azure;
using Core;
using Core.Constants;
using FastEndpoints;
using Infrastructure.Data;
using nmdb.Endpoints.Films.FilmRoleCategory;
using System.Web.Mvc;

namespace nmdb.Endpoints.Films.FilmRole
{
    //[Authorize(Roles = "User")]
    public class Create
    : Endpoint<CreateFilmRoleCategoryRequest, ApiResponse<string>>
    {
        private const string Route = "api/film/film-role-category";
        private AppDbContext _appDbContext;
        private readonly IUnitOfWork _unitOfWork;
        public Create(AppDbContext appDbContext, IUnitOfWork unitOfWork)
        {
            _appDbContext = appDbContext;
            _unitOfWork = unitOfWork;
        }
        public override void Configure()
        {
            Post(Route);
            Roles(AuthorizationConstants.AdminRole);
            Summary(s =>
            {
                s.ExampleRequest = new CreateFilmRoleCategoryRequest("Director", 1);
            });

        }

        public override async Task HandleAsync(CreateFilmRoleCategoryRequest request,
            CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.FilmRoleCategoryRepository.AddAsync(new Core.Entities.FilmRoleCategory
            {
                CategoryName = request.name,
                DisplayOrder = request.dislayOrder,
                CreatedBy = AuthorizationConstants.SuperUser
            });
            await _unitOfWork.CommitAsync();
            Response = ApiResponse<string>.SuccessResponse(null, message: "Film Role category created successfully.");
            return;
        }
    }
}
