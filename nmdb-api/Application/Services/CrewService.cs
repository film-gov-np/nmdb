using Application.CQRS.FilmRoles.Queries;
using Application.Dtos;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Dtos.Media;
using Application.Dtos.Movie;
using Application.Dtos.ProductionHouse;
using Application.Dtos.Theatre;
using Application.Helpers;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Models;
using Application.Validators;
using AutoMapper;
using Azure;
using Core;
using Core.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations.Builders;
using Microsoft.Extensions.Configuration;
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
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string _uploadFolderPathCrew;
    private readonly string _uploadFolderPathMovie;
    private readonly IWebHostEnvironment _environment;
    private const string crewUploadSubFolder = "crews";
    private const string movieUploadSubFolder = "movies";


    public CrewService(IUnitOfWork unitOfWork
        , IMapper mapper
        , IFileService fileService,
        ILogger<CrewService> logger,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration
        )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _fileService = fileService;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _uploadFolderPathCrew = string.Concat(configuration["UploadFolderPath"], $"/{crewUploadSubFolder}/");
        _uploadFolderPathMovie = string.Concat(configuration["UploadFolderPath"], $"/{movieUploadSubFolder}/");

    }
    public async Task<ApiResponse<PaginationResponse<CrewListDto>>> GetAllAsync(CrewFilterParameters filterParameters)
    {
        Expression<Func<Crew, bool>> filter = null;
        Expression<Func<Crew, object>> orderByColumn = null;
        Func<IQueryable<Crew>, IOrderedQueryable<Crew>> orderBy = null;


        // Apply filtering
        if ((filterParameters.IsVerified != null) || !string.IsNullOrEmpty(filterParameters.SearchKeyword))
        {
            filter = query =>
                (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.Name.Contains(filterParameters.SearchKeyword)
                || query.NickName.Contains(filterParameters.SearchKeyword)) && (
                    (filterParameters.IsVerified == null || filterParameters.IsVerified == query.IsVerified)
                );
        }

        if (!string.IsNullOrEmpty(filterParameters.SortColumn))
        {
            switch (filterParameters.SortColumn.ToLower())
            {
                case "name":
                    orderByColumn = query => query.Name == "Bhuwan K.C." ? 0 : 1;
                    break;
                case "nickname":
                    orderByColumn = query => query.ContactNumber;
                    break;
                case "email":
                    orderByColumn = query => query.Email;
                    break;
                // Add more cases for other columns
                default:
                    throw new ArgumentException($"Invalid sort column: {filterParameters.SortColumn}");
            }
        }

        var (query, totalItems) = await _unitOfWork.CrewRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);

        var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);

        var crewsResponse = await query.Select(
                                            tr => new CrewListDto
                                            {
                                                Id = tr.Id,
                                                Name = tr.Name,
                                                NickName = tr.NickName,
                                                Email = tr.Email,
                                                IsVerified = tr.IsVerified,
                                                NepaliName = tr.NepaliName,
                                                ProfilePhotoUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPathCrew, tr.ProfilePhoto),
                                            }).ToListAsync();

        var response = new PaginationResponse<CrewListDto>
        {
            Items = crewsResponse,
            TotalItems = totalItems,
            PageNumber = filterParameters.PageNumber,
            PageSize = filterParameters.PageSize
        };

        return ApiResponse<PaginationResponse<CrewListDto>>.SuccessResponse(response);
    }

    public async Task<ApiResponse<string>> CreateCrewAsync(CrewRequestDto crewRequestDto)
    {
        try
        {
            string? profilePhotoUrl = null;

            if (crewRequestDto.ProfilePhotoFile != null && crewRequestDto.ProfilePhotoFile.Length > 0)
            {
                var uploadResultApiResponse = await _fileService.UploadFile(new FileDTO { Files = crewRequestDto.ProfilePhotoFile, SubFolder = crewUploadSubFolder });
                if (!uploadResultApiResponse.IsSuccess)
                {
                    return ApiResponse<string>.ErrorResponse(uploadResultApiResponse.Message, uploadResultApiResponse.StatusCode);
                }
                profilePhotoUrl = uploadResultApiResponse?.Data?.FileName;
            }


            await _unitOfWork.BeginTransactionAsync();
            var crewEntity = _mapper.Map<Crew>(crewRequestDto);

            if (crewRequestDto.Designations != null)
            {
                foreach (var designation in crewRequestDto.Designations)
                {
                    crewEntity.CrewDesignations.Add(new CrewDesignation { RoleId = designation.Id, Crew = crewEntity });
                }
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
            var crewEntity = await _unitOfWork.CrewRepository.GetCrewByIdWithAllIncludedProperties(crewId);

            if (crewEntity == null)
            {
                return ApiResponse<string>.ErrorResponse($"Crew with '{crewId}' could not be found.", HttpStatusCode.NotFound);
            }

            _mapper.Map(crewRequestDto, crewEntity);

            if (crewRequestDto.Designations != null && crewRequestDto.Designations.Any())
            {
                crewEntity.CrewDesignations.Clear();
                foreach (var designationDto in crewRequestDto.Designations)
                {
                    var crewDesignation = new CrewDesignation
                    {
                        Crew = crewEntity,
                        RoleId = designationDto.Id
                    };
                    crewEntity.CrewDesignations.Add(crewDesignation);
                }
            }

            // Image Upload
            if (crewRequestDto.ProfilePhotoFile != null)
            {
                FileDTO fileDto = new FileDTO
                {
                    Files = crewRequestDto.ProfilePhotoFile,
                    Thumbnail = false,
                    ReadableName = false,
                    SubFolder = crewUploadSubFolder
                };
                var uploadResult = await _fileService.UploadFile(fileDto);
                if (uploadResult.IsSuccess && uploadResult.Data != null)
                {
                    // Delete existing image
                    if (!string.IsNullOrEmpty(crewEntity.ProfilePhoto))
                        _fileService.RemoveFile(crewEntity.ProfilePhoto, crewUploadSubFolder);

                    crewEntity.ProfilePhoto = uploadResult.Data.FileName;
                }
            }

            crewEntity.UpdatedBy = crewRequestDto.Authorship;
            await _unitOfWork.CrewRepository.UpdateAsync(crewEntity);
            await _unitOfWork.CommitAsync();
            response = ApiResponse<string>.SuccessResponseWithoutData($"The crew '{crewRequestDto.Name}' was updated successfully.", HttpStatusCode.OK);
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
            var crew = await _unitOfWork.CrewRepository.GetCrewByIdWithAllIncludedProperties(crewId);

            if (crew == null)
            {
                response.IsSuccess = false;
                response.Errors.Add("Crew not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var crewResponse = _mapper.Map<CrewResponseDto>(crew);
            var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);

            crewResponse.ProfilePhotoUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPathCrew, crewResponse.ProfilePhoto);

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

    private List<CrewDesignationDto> MapCrewDesignations(List<CrewDesignation> crewDesignations)
    {
        var crewDesignationDtos = new List<CrewDesignationDto>();
        foreach (var designation in crewDesignations)
        {
            CrewDesignationDto designationDto = new CrewDesignationDto
            {
                Id = designation.FilmRole.Id,
                RoleName = designation.FilmRole.RoleName
            };
            crewDesignationDtos.Add(designationDto);
        }

        return crewDesignationDtos;
    }


    private List<CrewMovieDto> MapCrewMovies(List<MovieCrewRole> movieCrewRoles)
    {
        var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);
        var crewMovieDtos = new List<CrewMovieDto>();
        foreach (var crewMovie in movieCrewRoles)
        {
            CrewMovieDto movie = new CrewMovieDto
            {
                Id = crewMovie.Movie.Id,
                Name = crewMovie.Movie.Name,
                NepaliName = crewMovie.Movie.NepaliName,
                ReleaseDateBS = crewMovie.Movie.ReleaseDateBS,
                ThumbnailImagePath = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPathMovie, crewMovie.Movie.ThumbnailImage),
            };
            crewMovieDtos.Add(movie);
        }

        return crewMovieDtos;
    }

    public async Task<ApiResponse<CrewResponseDto>> GetCrewByEmailAsync(string email)
    {
        var response = new ApiResponse<CrewResponseDto>();

        try
        {
            var crew = await _unitOfWork.CrewRepository.GetByEmailAsync(email);

            if (crew == null)
            {
                response.IsSuccess = false;
                response.Errors.Add("Crew not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var crewResponse = _mapper.Map<CrewResponseDto>(crew);

            var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);
            crewResponse.ProfilePhoto = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPathCrew, crewResponse.ProfilePhoto);

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
