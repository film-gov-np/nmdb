using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Crew : BaseEntity<int>
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    public string? NepaliName { get; set; }
    [MaxLength(100)]
    public string BirthName { get; set; }
    [MaxLength(100)]
    public string FatherName { get; set; }
    [MaxLength(100)]
    public string MotherName { get; set; }
    [MaxLength(100)]
    public string NickName { get; set; }
    [MaxLength(10)]
    public string Gender { get; set; }
    public DateTime? DateOfBirthInAD { get; set; }
    public string? DateOfBirthInBS { get; set; }
    public DateTime? DateOfDeathInAD { get; set; }
    public string? DateOfDeathInBS { get; set; }
    public string? BirthPlace { get; set; }
    public string? Height { get; set; }
    [MaxLength(50)]
    public string? StarSign { get; set; }
    public string? CurrentAddress { get; set; }
    public string? MiniBio { get; set; }
    public string? MiniBioNepali { get; set; }
    public string? TradeMark { get; set; }    
    public string? Trivia { get; set; }
    public string? Activities { get; set; }
    [MaxLength(400)]
    public string? ProfilePhoto { get; set; }
    public string? ThumbnailPhoto { get; set; }
    public string? OfficialSite { get; set; }
    public string? FacebookID { get; set; }
    public string? TwitterID { get; set; }
    [MaxLength(20)]
    public string ContactNumber { get; set; }
    [MaxLength(20)]
    public string? MobileNumber { get; set; }
    public int? ViewCount { get; set; }
    public bool IsVerified { get; set; } = false;
    public bool IsActive { get; set; } = false;

    public ICollection<CrewRole> CrewRoles { get; set; } = new List<CrewRole>();
    public ICollection<MovieCrewRole> MovieCrewRoles { get; set; } = new List<MovieCrewRole>();

}
