namespace Infrastructure.Identity.Security.TokenGenerator;

public class JwtSettings
{
    public const string Section = "ApiSettings:JwtSettings";
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int TokenExpirationInMinutes { get; set; }
    public int RefreshTokenExpirationInDays { get; set; }
}
