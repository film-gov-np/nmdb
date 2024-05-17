using Application.Dtos.FilterParameters;
using Application.Dtos.Movie;
using Application.Helpers.Response;
using Core;

namespace Application.Interfaces.Services;

public interface IMovieService
{
    Task<ApiResponse<string>> CreateAsync(MovieRequestDto movieRequestDto);
    Task<ApiResponse<string>> UpdateAsync(int movieId, MovieRequestDto movieRequestDto);
    Task<ApiResponse<string>> DeleteByIdAsync(int movieId);
    Task<ApiResponse<MovieResponseDto>> GetByIdAsync(int movieId);
    Task<ApiResponse<PaginationResponse<MovieListResponseDto>>> GetAllAsync(MovieFilterParameters filterParameters);
}
