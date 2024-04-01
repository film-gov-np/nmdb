using System.ComponentModel.DataAnnotations;

namespace nmdb.AuthEndpoints;

public class AuthenticateRequest
{
    public const string Route = "/api/auth/authenticate";  
    public string Email { get; set; }
    
    public string Password { get; set; }
}
