using Application.Dtos.Crew;
using Application.Dtos.Movie;
using Application.Dtos.Theatre;
using Application.Helpers.Response;

namespace Application.Dtos;

public class GlobalSearchResponseDto
{
    public PaginationResponse<MovieListResponseDto> Movies { get; set; }
    public PaginationResponse<CrewListDto> Crews { get; set; }
    public PaginationResponse<TheatreResponseDto> Theatres { get; set; }
}
