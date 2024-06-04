using Core.Constants;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Crew : BaseEntity<int>
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    [MaxLength(100)]
    public string? NepaliName { get; set; }
    [MaxLength(100)]
    public string? BirthName { get; set; }
    [MaxLength(100)]
    public string? FatherName { get; set; }
    [MaxLength(100)]
    public string? MotherName { get; set; }
    [MaxLength(100)]
    public string? NickName { get; set; }
    public int? Gender { get; set; }
    public DateTime? DateOfBirthInAD { get; set; }
    public string? DateOfBirthInBS { get; set; }
    public DateTime? DateOfDeathInAD { get; set; }
    [MaxLength(16)]
    public string? DateOfDeathInBS { get; set; }
    [MaxLength(100)]
    public string? BirthPlace { get; set; }
    [MaxLength(10)]
    public string? Height { get; set; }
    [MaxLength(50)]
    public string? StarSign { get; set; }
    [MaxLength(100)]
    public string? CurrentAddress { get; set; }
    public string? Biography { get; set; }
    public string? BiographyInNepali { get; set; }
    [MaxLength(100)]
    public string? TradeMark { get; set; }
    public string? Trivia { get; set; }
    public string? Activities { get; set; }
    [MaxLength(255)]
    public string? ProfilePhoto { get; set; }
    [MaxLength(255)]
    public string? ThumbnailPhoto { get; set; }
    [MaxLength(255)]
    public string? OfficialSite { get; set; }
    [MaxLength(255)]
    public string? FacebookID { get; set; }
    [MaxLength(255)]
    public string? TwitterID { get; set; }
    [MaxLength(20)]
    public string? ContactNumber { get; set; }
    [MaxLength(20)]
    public string? MobileNumber { get; set; }
    public int? ViewCount { get; set; }
    public bool IsVerified { get; set; } = false;
    public bool IsActive { get; set; } = false;
    public string? Email { get; set; }
    public virtual List<CrewDesignation> CrewDesignations { get; set; } = new List<CrewDesignation>();//Designation and Film Role are treated as the same
    public virtual List<MovieCrewRole> MovieCrewRoles { get; set; } = new List<MovieCrewRole>();
    public bool? HasRequestedCard { get; set; } = false;
}
