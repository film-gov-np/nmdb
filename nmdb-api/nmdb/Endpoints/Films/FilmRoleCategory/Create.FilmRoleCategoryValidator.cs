using FastEndpoints;
using FluentValidation;

namespace nmdb.Endpoints.Films.FilmRoleCategory;

public class CreateFilmRoleCategoryValidator : Validator<CreateFilmRoleCategoryRequest>
{
    public CreateFilmRoleCategoryValidator()
    {
        RuleFor(x => x.name).NotEmpty()
            .MaximumLength(30);
    }
}
