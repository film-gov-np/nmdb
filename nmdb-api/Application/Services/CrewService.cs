using Application.CQRS.FilmRoles.Queries;
using Application.Dtos;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Dtos.Media;
using Application.Dtos.ProductionHouse;
using Application.Dtos.Theatre;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Models;
using Application.Validators;
using AutoMapper;
using Core;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations.Builders;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using System.Net;
using System.Web.Mvc;

namespace Application.Services;

public class CrewService : ICrewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IFileService _fileService;
    private readonly ILogger<CrewService> _logger;


    public CrewService(IUnitOfWork unitOfWork
        , IMapper mapper
        , IFileService fileService,
        ILogger<CrewService> logger
        )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _fileService = fileService;
        _logger = logger;
    }
    public async Task<ApiResponse<PaginationResponse<CrewResponseDto>>> GetAllAsync(CrewFilterParameters filterParameters)
    {
        Expression<Func<Crew, bool>> filter = null;
        Expression<Func<Crew, object>> orderByColumn = null;
        Func<IQueryable<Crew>, IOrderedQueryable<Crew>> orderBy = null;


        // Apply filtering
        if (!string.IsNullOrEmpty(filterParameters.SearchKeyword))
        {
            filter = query =>
                (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.Name.Contains(filterParameters.SearchKeyword)
                || query.NickName.Contains(filterParameters.SearchKeyword));
        }

        if (!string.IsNullOrEmpty(filterParameters.SortColumn))
        {
            switch (filterParameters.SortColumn.ToLower())
            {
                case "name":
                    orderByColumn = query => query.Name;
                    break;
                case "nickname":
                    orderByColumn = query => query.ContactNumber;
                    break;
                // Add more cases for other columns
                default:
                    throw new ArgumentException($"Invalid sort column: {filterParameters.SortColumn}");
            }
        }

        var (query, totalItems) = await _unitOfWork.CrewRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);
        var theatreResponse = await query.Select(
                                            tr => new CrewResponseDto
                                            {
                                                Id = tr.Id,
                                                Name = tr.Name,
                                                NickName = tr.NickName,
                                            }).ToListAsync();

        var response = new PaginationResponse<CrewResponseDto>
        {
            Items = theatreResponse,
            TotalItems = totalItems,
            PageNumber = filterParameters.PageNumber,
            PageSize = filterParameters.PageSize
        };

        return ApiResponse<PaginationResponse<CrewResponseDto>>.SuccessResponse(response);
    }
    public async Task<ApiResponse<string>> CreateCrewAsync(CrewRequestDto crewRequestDto)
    {
        try
        {
            //var validationResult = await _crewRequestValidator.ValidateAsync(crewRequestDto);
            //if (!validationResult.IsValid)
            //{
            //    // If validation fails, return a response with validation errors
            //    return ApiResponse<string>.ErrorResponse(validationResult.Errors.Select(e => e.ErrorMessage).ToList(), HttpStatusCode.BadRequest);
            //}
            await _unitOfWork.BeginTransactionAsync();
            var crewEntity = _mapper.Map<Crew>(crewRequestDto);
            var filmRoles = await _unitOfWork.FilmRoleRepository.GetRolesByIdsAsync(crewRequestDto.Designations);

            // Associate crew with roleid
            foreach (int roleid in filmRoles)
            {
                crewEntity.CrewDesignations.Add(new CrewDesignation { RoleId = roleid });
            }

            string profilePhotoUrl = null;
            if (crewRequestDto.ProfilePhoto != null && crewRequestDto.ProfilePhoto.Length > 0)
            {
                var uploadResultApiResponse = await _fileService.UploadFile(new FileDTO { Files = crewRequestDto.ProfilePhoto });
                if (!uploadResultApiResponse.IsSuccess)
                {
                    return ApiResponse<string>.ErrorResponse(uploadResultApiResponse.Message, uploadResultApiResponse.StatusCode);
                }
                profilePhotoUrl = uploadResultApiResponse.Data.FilePath;
            }

            crewEntity.ProfilePhoto = profilePhotoUrl;
            await _unitOfWork.CrewRepository.AddAsync(crewEntity);
            await _unitOfWork.CommitAsync();

            return ApiResponse<string>.SuccessResponseWithoutData($"Crew {crewRequestDto.Name} added successfully.", HttpStatusCode.Created);
        }
        catch (Exception ex)
        {
            _unitOfWork.Rollback();
            return ApiResponse<string>.ErrorResponse($"Failed to create crew: {ex.Message}", HttpStatusCode.InternalServerError);
        }
    }

    public async Task<ApiResponse<string>> UpdateCrewAsync(int crewId, CrewRequestDto crewRequestDto)
    {
        var response = new ApiResponse<string>();
        try
        {
            var crew = await _unitOfWork.CrewRepository.GetByIdAsync(crewId);

            if (crew == null)
            {
                return ApiResponse<string>.ErrorResponse($"Crew with '{crewRequestDto.Id}' could not be found.", HttpStatusCode.NotFound);
            }

            _mapper.Map(crewRequestDto, crew);
            crew.Id = crewId;
            crew.UpdatedBy = crewRequestDto.AuditedBy;
            await _unitOfWork.CrewRepository.UpdateAsync(crew);
            await _unitOfWork.CommitAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating crew.");
            response = ApiResponse<string>.ErrorResponse(new List<string> { ex.Message }, HttpStatusCode.InternalServerError);
        }
        return response;
    }

    public async Task<ApiResponse<string>> DeleteCrewAsync(int crewId)
    {
        var response = new ApiResponse<string>();
        try
        {
            var deleteResult = await _unitOfWork.CrewRepository.DeleteAsync(crewId);

            if (!deleteResult)
            {
                return ApiResponse<string>.ErrorResponse("Crew not found.", HttpStatusCode.NotFound);
            }

            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>.SuccessResponseWithoutData("Crew deleted successfully.", HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting crew.");
            response = ApiResponse<string>.ErrorResponse(ex.Message, HttpStatusCode.InternalServerError);
        }
        return response;
    }

    public async Task<ApiResponse<CrewResponseDto>> GetCrewByIdAsync(int crewId)
    {
        var response = new ApiResponse<CrewResponseDto>();

        try
        {
            var crew = await _unitOfWork.CrewRepository.GetByIdAsync(crewId);

            if (crew == null)
            {
                response.IsSuccess = false;
                response.Errors.Add("Crew not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var crewResponse = _mapper.Map<CrewResponseDto>(crew);


            response.IsSuccess = true;
            response.Data = crewResponse;
            response.StatusCode = HttpStatusCode.OK;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving crew.");
            response.IsSuccess = false;
            response.Errors.Add("An error occurred while processing the request.");
            response.StatusCode = HttpStatusCode.InternalServerError;
        }

        return response;
    }



}
