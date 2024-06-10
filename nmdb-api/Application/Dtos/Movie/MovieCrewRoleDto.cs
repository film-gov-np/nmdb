namespace Application.Dtos.Movie;

public class MovieCrewRoleDto
{    
    public int RoleId { get; set; }
    public string? RoleName { get; set; }
    public List<CrewBasicDto> Crews { get; set; } = new List<CrewBasicDto>();
}

public class CrewBasicDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? NepaliName { get; set; }
    public string? NickName { get; set; }
    public string? ThumbnailPhoto { get; set; }
    public string? ProfilePhoto { get; set; }
    public string? ProfilePhotoUrl { get; set; }
    public string? Email { get; set; }
}
