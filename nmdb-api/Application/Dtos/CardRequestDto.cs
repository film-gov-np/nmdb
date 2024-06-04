using Application.Dtos.Crew;

namespace Application.Dtos;

public class CardRequestDto:BaseDto
{
    public int Id { get; set; }
    public bool? IsApproved { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public DateTime? ReadyDate { get; set; }    
    public CrewCardBasicDto Crew { get; set; }
}


