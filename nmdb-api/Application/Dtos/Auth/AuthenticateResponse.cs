namespace Application.Dtos.Auth;

public class AuthenticateResponse
{
    public string Id { get; set; }
    public string Email { get; set; }
    public bool IsVerified { get; set; }
    public string JwtToken { get; set; }

    //[JsonIgnore] // refresh token is returned in http only cookie
    public string RefreshToken { get; set; }
    public bool Authenticated { get; set; }
}
