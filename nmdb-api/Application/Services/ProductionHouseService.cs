using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Application.Interfaces.Repositories;
using Application.BaseManager;
using Application.Interfaces;
using AutoMapper;
using Application.Interfaces.Services;
using Core;
using Application.Dtos.ProductionHouse;
using Core.Entities;
using System.Net;

namespace Application.Services
{
    public class ProductionHouseService : IProductionHouseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IProductionHouseRepository _repository;
        public ProductionHouseService(IUnitOfWork unitOfWork, IMapper mapper, IProductionHouseRepository repository)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _repository = repository;
        }

        public async Task<ApiResponse<string>> Create(ProductionHouseReqDto productionHouseReqDto)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();
                //var existingproductionHouseReq=await _unitOfWork.productionHouseRepository.GetByNameAsync(productionHouseReqDto.);
                // if(existingproductionHouseReq is not null){
                //     return ApiResponse<string>.ErrorResponse("Production House already exists.", HttpStatusCode.BadRequest);
                // }
                var productionHouse = _mapper.Map<ProductionHouse>(productionHouseReqDto);
                await _unitOfWork.productionHouseRepository.AddAsync(productionHouse);
                await _unitOfWork.CommitAsync();
                return ApiResponse<string>.SuccessResponse("Production House created successfully.");
            }
            catch (Exception ex)
            {
                _unitOfWork.Rollback();
                return ApiResponse<string>.ErrorResponse($"Failed to create production house : {ex.Message}", HttpStatusCode.BadRequest);
            }
        }

        public Task<ApiResponse<string>> DeleteById(int roleId)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProductionHouseResDto>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse<ProductionHouseResDto>> GetById(int productHouseId)
        {
            var result = await _unitOfWork.productionHouseRepository.GetByIdAsync(productHouseId);
            if (result == null)
            {
                return new ApiResponse<ProductionHouseResDto>
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"The production house with id {productHouseId} does not exist.",
                };
            }
            return new ApiResponse<ProductionHouseResDto>
            {
                IsSuccess = true,
                StatusCode = HttpStatusCode.OK,
                Data = _mapper.Map<ProductionHouseResDto>(result)
            };

        }

        public Task<ApiResponse<ProductionHouseResDto>> GetByNameAsync(string name)
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse<string>> Update(int id, ProductionHouseReqDto productionHouseReqDto)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();
                var productionHouse = await _unitOfWork.productionHouseRepository.GetByIdAsync(id);
                if (productionHouse == null)
                {
                    return ApiResponse<string>.ErrorResponse("Production House not found.", HttpStatusCode.NotFound);
                }
                _mapper.Map(productionHouse, productionHouseReqDto);
                await _unitOfWork.productionHouseRepository.UpdateAsync(productionHouse);
                await _unitOfWork.CommitAsync();
                return ApiResponse<string>.SuccessResponse("Production House updated successfully.");
            }
            catch (Exception ex)
            {
                _unitOfWork.Rollback();
                return ApiResponse<string>.ErrorResponse($"Failed to update production house : {ex.Message}", HttpStatusCode.BadRequest);
            }
        }
    }

}