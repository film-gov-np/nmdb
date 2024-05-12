using Application.Dtos.Movie;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class MovieRequestValidator : AbstractValidator<MovieRequestDto>
{
    public MovieRequestValidator()
    {
        RuleFor(tr => tr.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
        RuleFor(tr => tr.NepaliName)
            .NotEmpty().WithMessage("Nepali Name is required.")
            .MaximumLength(100).WithMessage("Nepali Name cannot exceed 100 characters.");
        RuleFor(tr => tr.Tagline)
            .NotEmpty().WithMessage("Tagline is required.");
    }
}
