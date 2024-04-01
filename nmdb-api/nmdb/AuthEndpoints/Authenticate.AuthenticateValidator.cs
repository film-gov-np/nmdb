using FastEndpoints;
using FluentValidation;

namespace nmdb.AuthEndpoints
{
    public class AuthenticateValidator : Validator<AuthenticateRequest>
    {
        public AuthenticateValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty();
        }
    }
}
