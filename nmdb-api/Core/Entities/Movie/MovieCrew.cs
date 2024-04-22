namespace Core.Entities;

public class MovieCrew : BaseEntity<int>
{
    public int MovieId { get; set; }
    public int CrewId { get; set; }
    public int RoleId { get; set; }
    public string? RoleNickName { get; set; }
    public string? RoleNickNameNepali { get; set; }
}
