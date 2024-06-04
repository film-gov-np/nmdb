using Core.Entities;

namespace Application.Dtos;

public class CardRequest:BaseEntity<int>
{
    public int CrewId { get; set; }
    public Crew Crew { get; set; }
    public bool IsApproved { get; set; } = false;
    public DateTime? ApprovedDate { get; set; }
    public DateTime? ReadyDate { get; set; }

}
