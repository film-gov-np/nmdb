using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.FilterParameters;
using Application.Dtos.Theatre;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Models;
using AutoMapper;
using Core;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using System.Net;

namespace Application.Services;

public class TheatreService : ITheatreService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<TheatreService> _logger;
    public TheatreService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<TheatreService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }
    public async Task<ApiResponse<string>> CreateAsync(TheatreRequestDto theatreRequestDto)
    {
        var response = new ApiResponse<string>();

        try
        {
            var theatreEntity = _mapper.Map<Theatre>(theatreRequestDto);
            await _unitOfWork.TheatreRepository.AddAsync(theatreEntity);
            await _unitOfWork.CommitAsync();
            response = ApiResponse<string>.SuccessResponseWithoutData($"Theatre '{theatreRequestDto.Name}' created successfully.", HttpStatusCode.Created);

        }
        catch (AppException ex)
        {
            _logger.LogError(ex, "An error occurred while creating theatre.");
            response = ApiResponse<string>.ErrorResponse
            (
                new List<string> { "An error occurred while creating theatre." },
                HttpStatusCode.InternalServerError
            );
        }
        return response;
    }

    public async Task<ApiResponse<string>> DeleteByIdAsync(int theatreId)
    {
        var response = new ApiResponse<string>();
        try
        {
            var deleteResult = await _unitOfWork.TheatreRepository.DeleteAsync(theatreId);

            if (!deleteResult)
            {
                response = ApiResponse<string>.ErrorResponse($"Theatre with '{theatreId}' could not be found.", HttpStatusCode.NotFound);
            }

            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>.SuccessResponseWithoutData("Theatre deleted successfully.", HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while deleting theatre with id '{theatreId}'");
            response = ApiResponse<string>.ErrorResponse(ex.Message, HttpStatusCode.InternalServerError);
        }

        return response;
    }

    public async Task<ApiResponse<PaginationResponse<TheatreResponseDto>>> GetAllAsync(TheatreFilterParameters filterParameters)
    {
        Expression<Func<Theatre, bool>> filter = null;
        Expression<Func<Theatre, object>> orderByColumn = null;
        Func<IQueryable<Theatre>, IOrderedQueryable<Theatre>> orderBy = null;


        // Apply filtering
        if (!string.IsNullOrEmpty(filterParameters.SearchKeyword))
        {            
            filter = query =>                
                (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.Name.Contains(filterParameters.SearchKeyword)
                || query.ContactPerson.Contains(filterParameters.SearchKeyword));
        }

        if (!string.IsNullOrEmpty(filterParameters.SortColumn))
        {
            switch (filterParameters.SortColumn.ToLower())
            {
                case "contactperson":
                    orderByColumn = query => query.ContactPerson;
                    break;
                case "contactnumber":
                    orderByColumn = query => query.ContactNumber;
                    break;
                // Add more cases for other columns
                default:
                    throw new ArgumentException($"Invalid sort column: {filterParameters.SortColumn}");
            }
        }

        var (query, totalItems) = await _unitOfWork.TheatreRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);
        var theatreResponse = await query.Select(
                                            tr => new TheatreResponseDto
                                            {
                                                Id = tr.Id,
                                                Name = tr.Name,
                                                ContactPerson = tr.ContactPerson,
                                                ContactNumber = tr.ContactNumber,
                                                IsRunning = tr.IsRunning

                                            }).ToListAsync();

        var response = new PaginationResponse<TheatreResponseDto>
        {
            Items = theatreResponse,
            TotalItems = totalItems,
            PageNumber = filterParameters.PageNumber,
            PageSize = filterParameters.PageSize
        };

        return ApiResponse<PaginationResponse<TheatreResponseDto>>.SuccessResponse(response);
    }

    public async Task<ApiResponse<TheatreRequestDto>> GetByIdAsync(int theatreId)
    {
        var response = new ApiResponse<TheatreRequestDto>();

        try
        {
            var theatreObj = await _unitOfWork.TheatreRepository.GetByIdAsync(theatreId);

            if (theatreObj == null)
            {
                response.IsSuccess = false;
                response.Errors.Add($"Theatre with id '{theatreId}' could not be found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var theatreResponse = _mapper.Map<TheatreRequestDto>(theatreObj);

            response.IsSuccess = true;
            response.Data = theatreResponse;
            response.StatusCode = HttpStatusCode.OK;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while retrieving theatre with id '{theatreId}'.");
            response.IsSuccess = false;
            response.Errors.Add($"An error occurred while retrieving theatre with id '{theatreId}'.");
            response.StatusCode = HttpStatusCode.InternalServerError;
        }

        return response;
    }

    public async Task<ApiResponse<string>> UpdateAsync(int theatreId, TheatreRequestDto theatreRequestDto)
    {
        var response = new ApiResponse<string>();

        try
        {
            var theatre = await _unitOfWork.TheatreRepository.GetByIdAsync(theatreId);

            if (theatre == null)
            {
                return ApiResponse<string>.ErrorResponse($"Theatre with '{theatreRequestDto.Id}' could not be found.", HttpStatusCode.NotFound);
            }

            _mapper.Map(theatreRequestDto, theatre);
            theatre.Id = theatreId;
            await _unitOfWork.TheatreRepository.UpdateAsync(theatre);
            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>
                .SuccessResponseWithoutData($"Theatre '{theatreRequestDto.Name}' updated successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating the theatre.");
            response = ApiResponse<string>.ErrorResponse(new List<string> { ex.Message }, HttpStatusCode.InternalServerError);
        }

        return response;
    }
}
