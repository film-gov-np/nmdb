using Application.Dtos.ProductionHouse;
using FluentValidation;

namespace Application.Validators;

public class ProductionHouseRequestValidator : AbstractValidator<ProductionHouseRequestDto>
{
    public ProductionHouseRequestValidator()
    {
        RuleFor(tr => tr.Name)
           .NotEmpty().WithMessage("Name is required.")
           .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

        RuleFor(tr => tr.ChairmanName)
            .NotEmpty().WithMessage("Contact name is required.")
            .MaximumLength(50).WithMessage("Contact name cannot exceed 50 characters.");
        
        RuleFor(tr => tr.Address)
            .NotEmpty().WithMessage("Address is required.");

        RuleFor(tr => tr.EstablishedDate)
            .NotNull().WithMessage("Established date is required.")
            .LessThanOrEqualTo(DateTime.Now.ToString()).WithMessage("Established date must be in the past.");

        RuleFor(tr => tr.IsRunning)
            .NotNull().WithMessage("IsRunning flag is required.");

        // Validation for Id when used for creating
        //RuleFor(tr => tr.Id)
        //    //.Cascade(RuleLevelCascadeMode)
        //    //.Null().Must(id => id == null || id == 0).WithMessage("Id must be null or 0 when creating.")
        //    .GreaterThan(0).When(tr => tr.Id != null && tr.Id != 0).WithMessage("Id must be greater than 0 when not null.");
    }
}
