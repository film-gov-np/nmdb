
using System.ComponentModel.DataAnnotations;

namespace Application.Dtos.Auth;

public class ValidateResetTokenRequest
{
    [Required]
    public string Token { get; set; }
}
