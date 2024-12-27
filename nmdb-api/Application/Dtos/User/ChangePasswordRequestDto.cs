using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Application.Dtos.User;

public class ChangePasswordRequestDto
{
    [JsonIgnore]
    [BindNever]
    public string? Email { get; set; }
    public string CurrentPassword { get; set; }    

    [Required]    
    public string NewPassword { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [Display(Name = "Confirm Password")]
    [Compare("NewPassword",
        ErrorMessage = "Password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; }
}
