namespace Application.Dtos.Movie;

public class MovieCrewRoleDto
{
    public List<int> CrewIds { get; set; }
    public int RoleId { get; set; }
    public string? RoleNickName { get; set; }
    public string? RoleNickNameNepali { get; set; }
}
