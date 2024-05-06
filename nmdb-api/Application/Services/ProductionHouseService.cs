using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.FilterParameters;
using Application.Dtos.ProductionHouse;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Models;
using Application.Validators;
using AutoMapper;
using Core;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using System.Net;

namespace Application.Services;

public class ProductionHouseService : IProductionHouseService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<ProductionHouseService> _logger;
    private readonly ProductionHouseRequestValidator _productionHouseRequestValidator;

    public ProductionHouseService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ProductionHouseService> logger, ProductionHouseRequestValidator productionHouseRequestValidator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _productionHouseRequestValidator = productionHouseRequestValidator;
    }
    public async Task<ApiResponse<string>> CreateAsync(ProductionHouseRequestDto productionHouseRequestDto)
    {
        var response = new ApiResponse<string>();

        try
        {
            var validationResult = await _productionHouseRequestValidator.ValidateAsync(productionHouseRequestDto);
            if (!validationResult.IsValid)
            {
                // If validation fails, return a response with validation errors
                return ApiResponse<string>.ErrorResponse(validationResult.Errors.Select(e => e.ErrorMessage).ToList(), HttpStatusCode.BadRequest);
            }
            var productionHouseEntity = _mapper.Map<ProductionHouse>(productionHouseRequestDto);
            productionHouseEntity.CreatedBy = productionHouseRequestDto.AuditedBy;
            await _unitOfWork.ProductionHouseRepository.AddAsync(productionHouseEntity);
            await _unitOfWork.CommitAsync();
            response = ApiResponse<string>.SuccessResponseWithoutData($"ProductionHouse '{productionHouseRequestDto.Name}' created successfully.", HttpStatusCode.Created);

        }
        catch (AppException ex)
        {
            _logger.LogError(ex, "An error occurred while creating production house.");
            response = ApiResponse<string>.ErrorResponse
            (
                new List<string> { "An error occurred while creating production house." },
                HttpStatusCode.InternalServerError
            );
        }
        return response;
    }

    public async Task<ApiResponse<string>> DeleteByIdAsync(int productionHouseId)
    {
        var response = new ApiResponse<string>();
        try
        {
            var deleteResult = await _unitOfWork.ProductionHouseRepository.DeleteAsync(productionHouseId);

            if (!deleteResult)
            {
                response = ApiResponse<string>.ErrorResponse($"Production house with '{productionHouseId}' could not be found.", HttpStatusCode.NotFound);
            }

            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>.SuccessResponseWithoutData("Production house deleted successfully.", HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while deleting production house with id '{productionHouseId}'");
            response = ApiResponse<string>.ErrorResponse(ex.Message, HttpStatusCode.InternalServerError);
        }

        return response;
    }

    public async Task<ApiResponse<PaginationResponse<ProductionHouseResponseDto>>> GetAllAsync(ProductionHouseFilterParameters filterParameters)
    {
        Expression<Func<ProductionHouse, bool>> filter = null;
        Expression<Func<ProductionHouse, object>> orderByColumn = null;
        Func<IQueryable<ProductionHouse>, IOrderedQueryable<ProductionHouse>> orderBy = null;


        // Apply filtering
        if ((filterParameters.IsRunning != null) || !string.IsNullOrEmpty(filterParameters.SearchKeyword))
        {         
            filter = query =>                
                (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.Name.Contains(filterParameters.SearchKeyword)
                || query.ChairmanName.Contains(filterParameters.SearchKeyword)) &&(
                    (filterParameters.IsRunning == null || filterParameters.IsRunning == query.IsRunning)
                );
        }


        if (!string.IsNullOrEmpty(filterParameters.SortColumn))
        {
            switch (filterParameters.SortColumn.ToLower())
            {
                case "name":
                    orderByColumn = query => query.Name;
                    break;
                case "chairmanname":
                    orderByColumn = query => query.ChairmanName;
                    break;
                // Add more cases for other columns
                default:
                    throw new ArgumentException($"Invalid sort column: {filterParameters.SortColumn}");
            }
        }

        var (query, totalItems) = await _unitOfWork.ProductionHouseRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);
        var productionHouseResponse = await query.Select(
                                            tr => new ProductionHouseResponseDto
                                            {
                                                Id = tr.Id,
                                                Name = tr.Name,
                                                NepaliName = tr.NepaliName,
                                                ChairmanName = tr.ChairmanName,
                                                IsRunning = tr.IsRunning

                                            }).ToListAsync();

        var response = new PaginationResponse<ProductionHouseResponseDto>
        {
            Items = productionHouseResponse,
            TotalItems = totalItems,
            PageNumber = filterParameters.PageNumber,
            PageSize = filterParameters.PageSize
        };

        return ApiResponse<PaginationResponse<ProductionHouseResponseDto>>.SuccessResponse(response);
    }

    public async Task<ApiResponse<ProductionHouseRequestDto>> GetByIdAsync(int productionHouseId)
    {
        var response = new ApiResponse<ProductionHouseRequestDto>();

        try
        {
            var productionHouseObj = await _unitOfWork.ProductionHouseRepository.GetByIdAsync(productionHouseId);

            if (productionHouseObj == null)
            {
                response.IsSuccess = false;
                response.Errors.Add($"Production house with id '{productionHouseId}' could not be found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var productionHouseResponse = _mapper.Map<ProductionHouseRequestDto>(productionHouseObj);

            response.IsSuccess = true;
            response.Data = productionHouseResponse;
            response.StatusCode = HttpStatusCode.OK;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while retrieving production house with id '{productionHouseId}'.");
            response.IsSuccess = false;
            response.Errors.Add($"An error occurred while retrieving production house with id '{productionHouseId}'.");
            response.StatusCode = HttpStatusCode.InternalServerError;
        }

        return response;
    }

    public async Task<ApiResponse<string>> UpdateAsync(int productionHouseId, ProductionHouseRequestDto productionHouseRequestDto)
    {
        var response = new ApiResponse<string>();

        try
        {
            var validationResult = await _productionHouseRequestValidator.ValidateAsync(productionHouseRequestDto);
            if (!validationResult.IsValid)
            {                
                return ApiResponse<string>.ErrorResponse(validationResult.Errors.Select(e => e.ErrorMessage).ToList(), HttpStatusCode.BadRequest);
            }

            var productionHouse = await _unitOfWork.ProductionHouseRepository.GetByIdAsync(productionHouseId);

            if (productionHouse == null)
            {
                return ApiResponse<string>.ErrorResponse($"productionHouse with '{productionHouseRequestDto.Id}' could not be found.", HttpStatusCode.NotFound);
            }
            
            _mapper.Map(productionHouseRequestDto, productionHouse);
            productionHouse.Id = productionHouseId;
            productionHouse.UpdatedBy = productionHouseRequestDto.AuditedBy;
            await _unitOfWork.ProductionHouseRepository.UpdateAsync(productionHouse);
            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>
                .SuccessResponseWithoutData($"Production house '{productionHouseRequestDto.Name}' updated successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating the production house.");
            response = ApiResponse<string>.ErrorResponse(new List<string> { ex.Message }, HttpStatusCode.InternalServerError);
        }

        return response;
    }
}
