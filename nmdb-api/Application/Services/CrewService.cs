using Application.CQRS.FilmRoles.Queries;
using Application.Dtos;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Dtos.Media;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Models;
using AutoMapper;
using Core;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations.Builders;
using Microsoft.Extensions.Logging;
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
    public async Task<ApiResponse<string>> CreateCrewAsync(CrewRequestDto crewRequestDto)
    {
        try
        {
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

    public async Task<Application.Helpers.Response.PaginationResponse<CrewListDto>> GetCrewsAsync(CrewFilterParameters crewFilterParameters)
    {
        var query = _unitOfWork.CrewRepository.Get();
        var crewResponse = await query.Select(
        cr => new CrewListDto(
                         cr.Id,
                         cr.Name,
                         cr.FatherName,
                         cr.MotherName,
                         cr.NickName)).ToListAsync();

        int totalItems = await query.CountAsync();

        var paginatedResponse = new Helpers.Response.PaginationResponse<CrewListDto>
        {
            Items = crewResponse,
            TotalItems = totalItems,
            PageNumber = crewFilterParameters.PageNumber,
            PageSize = crewFilterParameters.PageSize
        };

        return paginatedResponse;

    }

    public Task<Core.PaginationResponseOld<CrewListDto>> GetCrewsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<ApiResponse<string>> UpdateCrewAsync(CrewRequestDto crewRequestDto)
    {
        throw new NotImplementedException();
    }
}
