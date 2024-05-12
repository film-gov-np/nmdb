using Application.Dtos;
using Application.Dtos.Film;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators
{
    public class CrewRequestValidator : AbstractValidator<CrewRequestDto>
    {
        public CrewRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
        }
    }
}
