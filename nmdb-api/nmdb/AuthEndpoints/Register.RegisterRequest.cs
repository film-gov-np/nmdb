namespace nmdb.AuthEndpoints;

public class RegisterRequest
{
    public const string Route = "/api/auth/register";
    public string Email{ get; set; }
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }

}