namespace Application.Dtos.Movie
{
    public class MovieResponseDto:MovieRequestDto
    {
        public string? ThumbnailImageUrl { get; set; }
        public string? CoverImageUrl { get; set; }
    }
}
