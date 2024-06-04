namespace Application.Dtos.Auth
{
    public class RegisterRequest
    {
        public const string Route = "api/auth/register";
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        public bool AcceptTerms { get; set; } = true;
    }
}
