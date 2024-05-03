namespace Application.Dtos.Theatre
{
    public class TheatreRequestDto : TheatreBaseDto
    {
        public string? Address { get; set; }
        public string? Email { get; set; }
        public DateTime? EstablishedDate { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? Remarks { get; set; }
        public bool IsRunning { get; set; } = false;
    }
}
