using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Dtos.ProductionHouse;
using Application.Helpers.Response;
using Core;

namespace Application.Interfaces.Services;

public interface IProductionHouseService
{
    Task<ApiResponse<string>> CreateAsync(ProductionHouseRequestDto productionHouseRequestDto);
    Task<ApiResponse<string>> UpdateAsync(int productionHouseId, ProductionHouseRequestDto productionHouseRequestDto);
    Task<ApiResponse<string>> DeleteByIdAsync(int productionHouseId);

    Task<ApiResponse<ProductionHouseRequestDto>> GetByIdAsync(int productionHouseId);
    Task<ApiResponse<PaginationResponse<ProductionHouseResponseDto>>> GetAllAsync(ProductionHouseFilterParameters filterParameters);
}
