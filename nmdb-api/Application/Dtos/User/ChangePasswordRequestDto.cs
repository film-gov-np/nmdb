using System.ComponentModel.DataAnnotations;

namespace Application.Dtos.User;

public class ChangePasswordRequestDto
{
    public string Email { get; set; }
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
