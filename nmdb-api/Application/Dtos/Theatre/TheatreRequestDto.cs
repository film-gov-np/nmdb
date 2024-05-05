using System.Text.Json.Serialization;

namespace Application.Dtos.Theatre
{
    public class TheatreRequestDto : TheatreBaseDto
    {
        public string Address { get; set; }
        public string Email { get; set; }
        public string EstablishedDate { get; set; }
        public string WebsiteUrl { get; set; }
        public string Remarks { get; set; }
        public int NumberOfScreen { get; set; }
        public int SeatCapacity { get; set; }
        public string? NepaliName { get; set; }
        [JsonIgnore]
        public string? AuditedBy { get; set; }
    }
}
