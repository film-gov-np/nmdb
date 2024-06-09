using Application.Dtos;
using Application.Dtos.Awards;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Core;

namespace Application.Interfaces.Services;

public interface IAwardsService
{
    Task<ApiResponse<PaginationResponse<AwardsListDto>>> GetAllAsync(AwardsFilterParameters filterParameters);
    Task<ApiResponse<string>> CreateAwardsAsync(AwardsRequestDto crewRequestDto);
    Task<ApiResponse<string>> UpdateAwardsAsync(int crewId, AwardsRequestDto crewRequestDto);
    Task<ApiResponse<AwardsResponseDto>> GetAwardsByIdAsync(int crewId);
    Task<ApiResponse<string>> DeleteAwardsAsync(int crewId);
}
