using FastEndpoints;
using FluentValidation;
namespace nmdb.Endpoints.Films.FilmRole;

public class CreateFilmRoleValidator : Validator<CreateFilmRoleRequest>
{
    public CreateFilmRoleValidator()
    {
        
    }
}
