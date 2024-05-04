using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dtos.ProductionHouse;
using Core;

namespace Application.Interfaces.Services
{
    public interface IProductionHouseService
    {
        Task<ApiResponse<string>> Create(ProductionHouseReqDto productionHouseReqDto);
        Task<ApiResponse<string>> Update(int id, ProductionHouseReqDto productionHouseReqDto);
        Task<ApiResponse<ProductionHouseResDto>> GetById(int roleId);
        Task<ApiResponse<string>> DeleteById(int roleId);
        Task<List<ProductionHouseResDto>> GetAllAsync();
        Task<ApiResponse<ProductionHouseResDto>> GetByNameAsync(string name);
    }
}