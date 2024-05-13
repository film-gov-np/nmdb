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
        RuleFor(mr => mr.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
        RuleFor(mr => mr.NepaliName)
            .NotEmpty().WithMessage("Nepali Name is required.")
            .MaximumLength(100).WithMessage("Nepali Name cannot exceed 100 characters.");
        RuleFor(mr => mr.Tagline)
            .NotEmpty().WithMessage("Tagline is required.");
        RuleFor(mr => mr.OneLiner)
            .NotEmpty().WithMessage("One liner is required.");
        RuleFor(mr => mr.FullMovieLink)
            .Matches(@"\b(?:https?://|www\.)\S+\b").WithMessage("Invalid URL format.");
        RuleFor(mr => mr.TrailerLink)
            .Matches(@"\b(?:https?://|www\.)\S+\b").WithMessage("Invalid URL format.");
        RuleFor(dto => dto.CrewRoles)
                .NotEmpty().WithMessage("At least one crew role must be assigned")
                .ForEach(crewRole =>
                {
                    crewRole.ChildRules(crewRoleDto =>
                    {
                        crewRoleDto.RuleFor(crewRoleDto => crewRoleDto.CrewIds)
                            .NotEmpty().WithMessage("A role should be assigned to at least one crew.");

                        crewRoleDto.RuleFor(crewRoleDto => crewRoleDto.RoleId)
                            .NotEmpty().WithMessage("Role ID is required");
                    });
                });
        RuleFor(dto => dto.Theatres)
                .NotEmpty().WithMessage("At least one theatre must be provided");

        RuleFor(dto => dto.ProductionHouseIds)
                .NotEmpty().WithMessage("At least one production house must be provided");
         
    }
}
