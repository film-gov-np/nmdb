using FastEndpoints;
using FluentValidation;

namespace nmdb.Endpoints.Films.FilmRole;

public class GetFilmRoleByIdValidator : Validator<GetFilmRoleByIdRequest>
{
    public GetFilmRoleByIdValidator()
    {
        RuleFor(x => x.FilmRoleId)
            .GreaterThan(0);
    }
}
