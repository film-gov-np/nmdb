using Core.Constants;
using Core.Entities;

namespace Application.Dtos.Movie;

public class MovieListResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string NepaliName { get; set; }
    public string? Category { get; set; }
    public string Status { get; set; }
    public string? ThumbnailImageUrl { get; set; }
    public string? Color { get; set; }
    public DateTime? ReleaseDate { get; set; }
}
