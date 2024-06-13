using Application.Dtos;
using Application.Dtos.Crew;
using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Dtos.Movie;
using Application.Dtos.Theatre;
using Application.Helpers;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Services;
using AutoMapper;
using Core;
using Core.Constants;
using Core.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Extensions;
using System.Linq.Expressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Application.Services;

public class CommonService : ICommonService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<CommonService> _logger;
    private readonly string _uploadFolderPathCrew;
    private readonly string _uploadFolderPathMovie;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CommonService(IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<CommonService> logger,
        IHttpContextAccessor httpContextAccessor,
         IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
        _uploadFolderPathCrew = string.Concat(configuration["UploadFolderPath"], "/crews/");
        _uploadFolderPathMovie = string.Concat(configuration["UploadFolderPath"], "/movies/");
    }

    public async Task<ApiResponse<List<FilmRoleBasicDto>>> GetAllRoles()
    {
        try
        {
            var filmRoles = await _unitOfWork.FilmRoleRepository.GetAllRoles();
            var filmRolesDto = _mapper.Map<List<FilmRoleBasicDto>>(filmRoles);
            var response = ApiResponse<List<FilmRoleBasicDto>>.SuccessResponse(filmRolesDto);

            return response;
        }
        catch (Exception ex)
        {
            return ApiResponse<List<FilmRoleBasicDto>>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponse<GlobalSearchResponseDto>> GetGlobalSearchResults(BaseFilterParameters filterParams)
    {
        try
        {
            var (movieQuery, totalMovieItems) = await _unitOfWork.MovieRepository.GetWithFilter(filterParams, m => m.Name.Contains(filterParams.SearchKeyword));
            var (crewQuery, totalCrewItems) = await _unitOfWork.CrewRepository.GetWithFilter(filterParams, c => c.Name.Contains(filterParams.SearchKeyword));
            var (theatreQuery, totalTheatreItems) = await _unitOfWork.TheatreRepository.GetWithFilter(filterParams, t => t.Name.Contains(filterParams.SearchKeyword));

            var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);

            var crewResponse = await crewQuery.Select(cr => new CrewListDto
            {
                Id = cr.Id,
                Name = cr.Name,
                Email = cr.Email,
                NepaliName = cr.NepaliName,
                ProfilePhotoUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPathCrew, cr.ProfilePhoto),
            }).ToListAsync();

            var movieResponse = await movieQuery.Select(m => new MovieListResponseDto
            {
                Id = m.Id,
                Name = m.Name,
                NepaliName = m.NepaliName,
                Category = m.Category != null ? m.Category.GetDisplayName() : eMovieCategory.None.GetDisplayName(),
                Status = m.Status != null ? m.Status.GetDisplayName() : eMovieStatus.Unknown.GetDisplayName(),
                Color = m.Color != null ? m.Color.GetDisplayName() : eMovieColor.None.GetDisplayName(),
                ThumbnailImageUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPathMovie, m.ThumbnailImage)
            }).ToListAsync();

            var theatreResponse = await theatreQuery.Select(tr => new TheatreResponseDto
            {
                Id = tr.Id,
                Name = tr.Name,
                ContactPerson = tr.ContactPerson,
                ContactNumber = tr.ContactNumber,
                IsRunning = tr.IsRunning
            }).ToListAsync();

            var globalSearchResults = new GlobalSearchResponseDto
            {
                Movies = new PaginationResponse<MovieListResponseDto>
                {
                    Items = movieResponse,
                    TotalItems = totalMovieItems,
                    PageNumber = filterParams.PageNumber,
                    PageSize = filterParams.PageSize
                },
                Crews = new PaginationResponse<CrewListDto>
                {
                    Items = crewResponse,
                    TotalItems = totalCrewItems,
                    PageNumber = filterParams.PageNumber,
                    PageSize = filterParams.PageSize
                },
                Theatres = new PaginationResponse<TheatreResponseDto>
                {
                    Items = theatreResponse,
                    TotalItems = totalCrewItems,
                    PageNumber = filterParams.PageNumber,
                    PageSize = filterParams.PageSize
                }
            };

            return ApiResponse<GlobalSearchResponseDto>.SuccessResponse(globalSearchResults);
        }
        catch (Exception ex)
        {

            return ApiResponse<GlobalSearchResponseDto>.ErrorResponse(ex.Message);

        }
    }
}