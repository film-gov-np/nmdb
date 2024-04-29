using Application.Dtos.Film;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators
{
    public class FilmRoleRequestValidator : AbstractValidator<FilmRoleRequest>
    {
        public FilmRoleRequestValidator()
        {
            RuleFor(x => x.RoleName).NotEmpty().WithMessage("RoleName is required");
            RuleFor(x => x.RoleCategoryId).GreaterThan(0).WithMessage("RoleCategoryId must be greater than 0");
        }
    }
}
