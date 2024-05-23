namespace Core.Entities;

public class MovieCrewRole : BaseEntity<int>
{
    public int MovieId { get; set; }
    public Movie Movie { get; set; }
    public int CrewId { get; set; }
    public Crew Crew { get; set; }
    public int RoleId { get; set; }
    public FilmRole FilmRole { get; set; }
}
