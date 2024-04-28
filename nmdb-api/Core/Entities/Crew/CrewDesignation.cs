using System.ComponentModel.DataAnnotations;

namespace Core.Entities;

//public class CrewDesignation : BaseEntity<int>
//{
//    [MaxLength(100)]
//    public string Name { get; set; }
//    public string CrewRole { get; set; }
//    public string? SearchThumbnail { get; set; }
//    [MaxLength(5)]
//    public string? Title { get; set; }
//}


public class CrewDesignation : BaseEntity<int>
{
    public int CrewId { get; set; }
    public  Crew Crew { get; set; }

    public int RoleId { get; set; }
    public FilmRole FilmRole { get; set; }
}