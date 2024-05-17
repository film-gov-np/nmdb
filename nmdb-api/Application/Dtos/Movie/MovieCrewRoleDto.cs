namespace Application.Dtos.Movie;

public class MovieCrewRoleDto
{    
    public int RoleId { get; set; }
    public string? RoleNickName { get; set; }
    public string? RoleNickNameNepali { get; set; }
    public List<CrewBasicDto> Crews { get; set; } = new List<CrewBasicDto>();
}

public class CrewBasicDto
{
    public int CrewId { get; set; }
    public string? Name { get; set; }
    public string? ThumbnailPhoto { get; set; }
    public string? Email { get; set; }
}
