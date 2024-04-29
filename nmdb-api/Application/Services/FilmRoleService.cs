using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Services;
using AutoMapper;
using Core;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using System.Net;

namespace Application.Services;

public class FilmRoleService : IFilmRoleService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<FilmRoleService> _logger;

    public FilmRoleService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<FilmRoleService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<FilmRoleDto>> CreateAsync(FilmRoleDto filmRoleDto)
    {
        try
        {
            var filmRole = _mapper.Map<FilmRole>(filmRoleDto);
            await _unitOfWork.FilmRoleRepository.AddAsync(filmRole);
            await _unitOfWork.CommitAsync();
            return ApiResponse<FilmRoleDto>.SuccessResponse(filmRoleDto, "Film role created successfully.", HttpStatusCode.Created);
        }
        catch (AppException ex)
        {
            _logger.LogError(ex, "An error occurred while creating the film role.");
            return ApiResponse<FilmRoleDto>.ErrorResponse
            (
                new List<string> { "An error occurred while creating the film role." },
                HttpStatusCode.InternalServerError
            );
        }
    }
    public async Task<ApiResponse<FilmRoleDto>> UpdateAsync(int roleId, FilmRoleDto filmRoleDto)
    {
        var response = new ApiResponse<FilmRoleDto>();

        try
        {
            var filmRole = await _unitOfWork.FilmRoleRepository.GetByIdAsync(roleId);

            if (filmRole == null)
            {
                return ApiResponse<FilmRoleDto>.ErrorResponse("Film role not found.", HttpStatusCode.NotFound);
            }

            _mapper.Map(filmRoleDto, filmRole);
            filmRole.Id = roleId;
            await _unitOfWork.FilmRoleRepository.UpdateAsync(filmRole);
            await _unitOfWork.CommitAsync();

            response = ApiResponse<FilmRoleDto>
                .SuccessResponse(_mapper.Map<FilmRoleDto>(filmRole)
                , "Film role updated successfully."
                );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating a film role.");
            response = ApiResponse<FilmRoleDto>.ErrorResponse(new List<string> { ex.Message }, HttpStatusCode.InternalServerError);
        }

        return response;
    }

    public async Task<ApiResponse<FilmRoleDto>> UpdateDisplayOrderAsync(int roleId, int displayOrder)
    {
        var response = new ApiResponse<FilmRoleDto>();

        try
        {
            var filmRole = await _unitOfWork.FilmRoleRepository.GetByIdAsync(roleId);

            if (filmRole == null)
            {
                return ApiResponse<FilmRoleDto>.ErrorResponse("Film role not found.", HttpStatusCode.NotFound);
            }

            filmRole.DisplayOrder = displayOrder;

            await _unitOfWork.FilmRoleRepository.UpdateAsync(filmRole);
            await _unitOfWork.CommitAsync();

            response = ApiResponse<FilmRoleDto>
                .SuccessResponse(data: null, message: $"Film role's display order updated to '{displayOrder}'.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating display order of the film role.");
            response = ApiResponse<FilmRoleDto>.ErrorResponse(new List<string> { ex.Message }, HttpStatusCode.InternalServerError);
        }

        return response;
    }

    public async Task<ApiResponse<string>> DeleteByIdAsync(int roleId)
    {
        var response = new ApiResponse<string>();
        try
        {
            var deleteResult = await _unitOfWork.FilmRoleRepository.DeleteAsync(roleId);

            if (!deleteResult)
            {
                return ApiResponse<string>.ErrorResponse("Film role not found.", HttpStatusCode.NotFound);
            }

            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>.SuccessResponseWithoutData("Film role deleted successfully.", HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting a film role.");
            response = ApiResponse<string>.ErrorResponse(ex.Message, HttpStatusCode.InternalServerError);
        }

        return response;
    }


    public async Task<ApiResponse<PaginationResponse<FilmRoleResponse>>> GetAllAsync(FilmRoleFilterParameters filterParameters)
    {
        Expression<Func<FilmRole, bool>> filter = null;
        Expression<Func<FilmRole, object>> orderByColumn = null;
        Func<IQueryable<FilmRole>, IOrderedQueryable<FilmRole>> orderBy = null;


        // Apply filtering
        if (filterParameters.CategoryId != null || !string.IsNullOrEmpty(filterParameters.SearchKeyword))
        {
            filter = query =>
                (filterParameters.CategoryId == null || query.RoleCategoryId == filterParameters.CategoryId) &&
                (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.RoleName.Contains(filterParameters.SearchKeyword));
        }

        if (!string.IsNullOrEmpty(filterParameters.SortColumn))
        {
            switch (filterParameters.SortColumn.ToLower())
            {
                case "rolename":
                    orderByColumn = query => query.RoleName;
                    break;
                case "categoryname":
                    orderByColumn = query => query.RoleCategory.CategoryName;
                    break;
                // Add more cases for other columns
                default:
                    throw new ArgumentException($"Invalid sort column: {filterParameters.SortColumn}");
            }
        }

        var (query, totalItems) = await _unitOfWork.FilmRoleRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);
        var filmRoleResponse = await query.Select(
        fr => new FilmRoleResponse(
                         fr.Id,
                         fr.RoleName,
                         fr.RoleCategory.CategoryName,
                         fr.DisplayOrder)).ToListAsync();

        var response = new PaginationResponse<FilmRoleResponse>
        {
            Items = filmRoleResponse,
            TotalItems = totalItems,
            PageNumber = filterParameters.PageNumber,
            PageSize = filterParameters.PageSize
        };

        return ApiResponse<PaginationResponse<FilmRoleResponse>>.SuccessResponse(response);
    }

    public async Task<ApiResponse<FilmRoleResponse>> GetByIdAsync(int roleId)
    {
        var response = new ApiResponse<FilmRoleResponse>();

        try
        {
            var filmRole = await _unitOfWork.FilmRoleRepository.GetByIdAsync(roleId);

            if (filmRole == null)
            {
                response.IsSuccess = false;
                response.Errors.Add("Film role not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            if (filmRole.RoleCategory == null && filmRole.RoleCategoryId != null)
            {
                filmRole.RoleCategory = await _unitOfWork.FilmRoleCategoryRepository.GetByIdAsync(filmRole.RoleCategoryId);
            }

            var filmRoleResponse = _mapper.Map<FilmRoleResponse>(filmRole);

            filmRoleResponse.CategoryName = filmRole.RoleCategory?.CategoryName ?? string.Empty;

            response.IsSuccess = true;
            response.Data = filmRoleResponse;
            response.StatusCode = HttpStatusCode.OK;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving a film role.");
            response.IsSuccess = false;
            response.Errors.Add("An error occurred while processing the request.");
            response.StatusCode = HttpStatusCode.InternalServerError;
        }

        return response;
    }
}
