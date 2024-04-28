using Application.CQRS.FilmRoles.Queries;
using Application.Dtos;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Dtos.Media;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using AutoMapper;
using Core;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations.Builders;
using System.Net;
using System.Web.Mvc;

namespace Application.Services;

public class CrewService : ICrewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFilmRoleRepository _filmRoleRepository;
    private readonly IMapper _mapper;
    private readonly IFileService _fileService;
    public CrewService(IUnitOfWork unitOfWork
        , IFilmRoleRepository filmRoleRepository
        , IMapper mapper
        , IFileService fileService
        )
    {
        _unitOfWork = unitOfWork;
        _filmRoleRepository = filmRoleRepository;
        _mapper = mapper;
        _fileService = fileService;
    }
    public async Task<ApiResponse<string>> CreateCrewAsync(CrewRequestDto crewRequestDto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();
            var crewEntity = _mapper.Map<Crew>(crewRequestDto);
            var designations = await _filmRoleRepository.GetRolesByIdsAsync(crewRequestDto.Designations);

            // Associate crew with designation
            foreach (var designation in designations)
            {
                crewEntity.CrewDesignations.Add(new CrewDesignation { FilmRole = designation });
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
            return ApiResponse<string>.ErrorResponse($"Failed to create crew: {ex.Message}", HttpStatusCode.InternalServerError);
        }
    }

    public Task<ApiResponse<bool>> DeleteCrewAsync(int crewId)
    {
        throw new NotImplementedException();
    }

    public Task<ApiResponse<CrewResponseDto>> GetCrewByIdAsync(int crewId)
    {
        throw new NotImplementedException();
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
