using Application.Dtos.Theatre;

namespace Application.Dtos.Movie;

public class MovieTheatreDto
{
    public List<TheatreDetailsDto> MovieTheatreDetails { get; set; }
    public DateTime ShowingDate { get; set; }
}

