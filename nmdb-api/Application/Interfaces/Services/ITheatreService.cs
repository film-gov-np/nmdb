using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Dtos.Theatre;
using Application.Helpers.Response;
using Core;

namespace Application.Interfaces.Services;

public interface ITheatreService
{
    Task<ApiResponse<string>> CreateAsync(TheatreRequestDto theatreRequestDto);
    Task<ApiResponse<string>> UpdateAsync(int theatreId, TheatreRequestDto theatreRequestDto);
    Task<ApiResponse<string>> DeleteByIdAsync(int theatreId);

    Task<ApiResponse<TheatreRequestDto>> GetByIdAsync(int theatreId);
    Task<ApiResponse<PaginationResponse<TheatreResponseDto>>> GetAllAsync(TheatreFilterParameters filterParameters);
}
