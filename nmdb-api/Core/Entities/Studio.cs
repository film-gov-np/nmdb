using System.ComponentModel.DataAnnotations;

namespace Core.Entities;

public class Studio : BaseEntity<int>
{
    public string Name { get; set; }
    public string? NepaliName { get; set; }
    public string Address { get; set; }
    public string ContactPerson { get; set; }
    [MaxLength(20)]
    public string ContactNumber { get; set; }
    public DateTime? EstablishedDateInAD { get; set; }
    public string EstablishedDateInBS { get; set; }
    public string Chairman { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsCollasped { get; set; } = false;
}
