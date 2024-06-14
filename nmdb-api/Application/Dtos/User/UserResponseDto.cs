namespace Application.Dtos.User;

public class UserResponseDto : UserBasicDto
{
    public string ProfilePhotoUrl { get; set; }
    public string? PhoneNumber { get; set; }
}
