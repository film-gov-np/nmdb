using Azure;
using Core;
using Core.Constants;
using FastEndpoints;
using Infrastructure.Data;
using nmdb.Endpoints.Films.FilmRoleCategory;

namespace nmdb.Endpoints.Films.FilmRole
{
    public class Create
        : Endpoint<CreateFilmRoleCategoryRequest, ApiResponse<string>>
    {
        private const string Route = "api/film/role-category/create";
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
                s.ExampleRequest = new CreateFilmRoleCategoryRequest("Director", 1);
            });

        }

        public override async Task HandleAsync(CreateFilmRoleCategoryRequest request,
            CancellationToken cancellationToken)
        {
            var result = _appDbContext.FilmRoleCategory.Add(new Core.Entities.FilmRoleCategory
            {
                CategoryName = request.name,
                DisplayOrder=request.dislayOrder,
                CreatedBy=AuthorizationConstants.SuperUser                
            });
            await _appDbContext.SaveChangesAsync();
            Response = ApiResponse<string>.SuccessResponse("Film Role category created successfully.");
            return;
        }
    }
}
