using Core.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity;

public class ApplicationUser : IdentityUser, IBaseEntity<string>
{
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string? Name { get; set; } = string.Empty;
    public List<RefreshToken> RefreshTokens { get; set; }
    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpires { get; set; }
    public DateTime? PasswordReset { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime? Updated { get; set; }
    public string? VerificationToken { get; set; }
    public DateTime? Verified { get; set; }
    public bool OwnsToken(string token)
    {
        return this.RefreshTokens?.Find(x => x.Token == token) != null;
    }
    public bool AcceptTerms { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
    public string? ProfilePhoto { get; set; }
}
