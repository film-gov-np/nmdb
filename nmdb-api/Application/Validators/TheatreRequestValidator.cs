using Application.Dtos.Theatre;
using FluentValidation;

namespace Application.Validators;

public class TheatreRequestValidator : AbstractValidator<TheatreRequestDto>
{
    public TheatreRequestValidator()
    {
        RuleFor(tr => tr.Name)
           .NotEmpty().WithMessage("Name is required.")
           .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

        RuleFor(tr => tr.ContactPerson)
            .NotEmpty().WithMessage("Contact name is required.")
            .MaximumLength(50).WithMessage("Contact name cannot exceed 50 characters.");

        RuleFor(tr => tr.ContactNumber)
            .NotEmpty().WithMessage("Contact number is required.")
            .Matches(@"^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$").WithMessage("Invalid contact number format.");
        
        RuleFor(tr => tr.Address)
            .NotEmpty().WithMessage("Address is required.");

        RuleFor(tr => tr.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email address.");

        RuleFor(tr => tr.EstablishedDate)
            .NotNull().WithMessage("Established date is required.")
            .LessThanOrEqualTo(DateTime.Now.ToString()).WithMessage("Established date must be in the past.");

        RuleFor(tr => tr.WebsiteUrl)
            .NotEmpty().WithMessage("Website URL is required.")
            .Matches(@"\b(?:https?://|www\.)\S+\b").WithMessage("Invalid URL format.");

        RuleFor(tr => tr.Remarks)
            .MaximumLength(500).WithMessage("Remarks cannot exceed 500 characters.");

        RuleFor(tr => tr.IsRunning)
            .NotNull().WithMessage("IsRunning flag is required.");

        // Validation for Id when used for creating
        //RuleFor(tr => tr.Id)
        //    //.Cascade(RuleLevelCascadeMode)
        //    //.Null().Must(id => id == null || id == 0).WithMessage("Id must be null or 0 when creating.")
        //    .GreaterThan(0).When(tr => tr.Id != null && tr.Id != 0).WithMessage("Id must be greater than 0 when not null.");
    }
}
