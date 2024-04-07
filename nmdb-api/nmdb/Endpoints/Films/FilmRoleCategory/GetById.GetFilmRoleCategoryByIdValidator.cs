using FastEndpoints;
using FluentValidation;

namespace nmdb.Endpoints.Films.FilmRoleCategory;

public class GetFilmRoleCategoryByIdValidator : Validator<GetFilmRoleCategoryByIdRequest>
{
    public GetFilmRoleCategoryByIdValidator()
    {
        RuleFor(x => x.FilmRoleCategoryId)
            .GreaterThan(0);
    }
}
