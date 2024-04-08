using FastEndpoints;
using Core;
using Infrastructure.Data;

namespace nmdb.Endpoints.Films.FilmRoleCategory
{
    public class GetById(AppDbContext appDbContext)
        : Endpoint<GetFilmRoleCategoryByIdRequest, ApiResponse<FilmRoleCategoryRecord>>
    {
        public override void Configure()
        {
            Get(GetFilmRoleCategoryByIdRequest.Route);
            AllowAnonymous();
        }

        public override async Task HandleAsync(GetFilmRoleCategoryByIdRequest request,
          CancellationToken cancellationToken)
        {

            await SendOkAsync();
        }
    }
}
