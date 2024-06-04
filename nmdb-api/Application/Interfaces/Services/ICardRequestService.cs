using Application.Dtos;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Core;

namespace Application.Interfaces.Services;

public interface ICardRequestService
{
    Task<ApiResponse<string>> RequestCardAsync(int crewId);
    Task<ApiResponse<string>> ApproveCardRequestAsync(int cardId , CardRequestDto cardRequestDto);
    Task<ApiResponse<PaginationResponse<CardRequestDto>>> GetAllAsync(CardRequestFilterParameters filterParameters);
    Task<ApiResponse<CardRequestDto>> GetByIdAsync(int crewId);

}
