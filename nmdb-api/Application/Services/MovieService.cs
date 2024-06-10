using Application.Dtos;
using Application.Dtos.FilterParameters;
using Application.Dtos.Media;
using Application.Dtos.Movie;
using Application.Dtos.ProductionHouse;
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
using System.Net;

namespace Application.Services;

public class MovieService : IMovieService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MovieService> _logger;
    private readonly IFileService _fileService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly string _uploadFolderPath;


    public MovieService(IMapper mapper, ILogger<MovieService> logger,
        IUnitOfWork unitOfWork,
        IFileService fileService,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _fileService = fileService;
        _httpContextAccessor = httpContextAccessor;
        _uploadFolderPath = string.Concat(configuration["UploadFolderPath"], "/movies/");
    }

    public async Task<ApiResponse<string>> CreateAsync(MovieRequestDto movieRequestDto)
    {
        var response = new ApiResponse<string>();

        try
        {
            if (movieRequestDto == null)
            {
                throw new ArgumentNullException(nameof(movieRequestDto));
            }

            await _unitOfWork.BeginTransactionAsync();

            var movieEntity = _mapper.Map<Movie>(movieRequestDto);

            // Thumbnail Image Upload
            if (movieRequestDto.ThumbnailImageFile != null)
            {
                FileDTO fileDto = new FileDTO
                {
                    Files = movieRequestDto.ThumbnailImageFile,
                    Thumbnail = false,
                    ReadableName = false,
                    SubFolder = "movies"
                };
                var uploadResult = await _fileService.UploadFile(fileDto);
                if (uploadResult.IsSuccess && uploadResult.Data != null)
                {
                    movieEntity.ThumbnailImage = uploadResult.Data.FileName;
                }
            }

            // Cover Image Upload
            if (movieRequestDto.CoverImageFile != null)
            {
                FileDTO fileDto = new FileDTO
                {
                    Files = movieRequestDto.CoverImageFile,
                    Thumbnail = false,
                    ReadableName = true,
                    SubFolder = "movies"
                };
                var uploadResult = await _fileService.UploadFile(fileDto);
                if (uploadResult.IsSuccess && uploadResult.Data != null)
                {
                    movieEntity.CoverImage = uploadResult.Data.FileName;
                }
            }

            if (movieRequestDto.CrewRoles != null && movieRequestDto.CrewRoles.Any())
            {
                foreach (var crewRole in movieRequestDto.CrewRoles)
                {
                    foreach (var crew in crewRole.Crews)
                    {
                        var crewRoleEntity = new MovieCrewRole
                        {
                            CrewId = crew.Id,
                            RoleId = crewRole.RoleId,
                            Movie = movieEntity
                        };

                        movieEntity.MovieCrewRoles.Add(crewRoleEntity);
                    }
                }
            }

            if (movieRequestDto.Theatres != null && movieRequestDto.Theatres.Any())
            {
                foreach (var movie in movieRequestDto.Theatres)
                {
                    foreach (var theatre in movie.MovieTheatreDetails)
                    {
                        var theatreEntity = new MovieTheatre
                        {
                            TheatreId = theatre.Id,
                            ShowingDate = movie.ShowingDate,
                            Movie = movieEntity
                        };
                        movieEntity.MovieTheatres.Add(theatreEntity);
                    }
                }
            }

            if (movieRequestDto.ProductionHouses != null && movieRequestDto.ProductionHouses.Any())
            {
                foreach (var productionHouse in movieRequestDto.ProductionHouses)
                {
                    var productionHouseEntity = new MovieProductionHouse
                    {
                        Movie = movieEntity,
                        ProductionHouseId = productionHouse.Id,
                    };
                    movieEntity.MovieProductionHouses.Add(productionHouseEntity);
                }
            }

            if (movieRequestDto.Censor != null)
            {
                var censorEntity = _mapper.Map<MovieCensor>(movieRequestDto.Censor);
                movieEntity.Censor = censorEntity;
            }

            if (movieRequestDto.Languages != null && movieRequestDto.Languages.Any())
            {
                foreach (var languageDto in movieRequestDto.Languages)
                {
                    var movieLanguageEntity = new MovieLanguage
                    {
                        Movie = movieEntity,
                        LanguageId = languageDto.Id
                    };
                    movieEntity.MovieLanguages.Add(movieLanguageEntity);
                }
            }

            if (movieRequestDto.Genres != null && movieRequestDto.Genres.Any())
            {
                foreach (var genreDto in movieRequestDto.Genres)
                {
                    var movieGenreEntity = new MovieGenre
                    {
                        Movie = movieEntity,
                        GenreId = genreDto.Id
                    };
                    movieEntity.MovieGenres.Add(movieGenreEntity);
                }
            }
            movieEntity.CreatedBy = movieRequestDto.AuditedBy;

            await _unitOfWork.MovieRepository.AddAsync(movieEntity);
            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>.SuccessResponseWithoutData($"The movie '{movieRequestDto.Name}' was created successfully.", HttpStatusCode.Created);
        }
        catch (Exception ex)
        {
            _unitOfWork.Rollback();
            _logger.LogError(ex, "An error occurred while creating movie.");
            response = ApiResponse<string>.ErrorResponse
            (
                new List<string> { "An error occurred while creating movie." },
                HttpStatusCode.InternalServerError
            );
        }
        return response;
    }

    public async Task<ApiResponse<string>> DeleteByIdAsync(int movieId)
    {
        var response = new ApiResponse<string>();
        try
        {
            var deleteResult = await _unitOfWork.MovieRepository.DeleteAsync(movieId);

            if (!deleteResult)
            {
                response = ApiResponse<string>.ErrorResponse($"Movie with '{movieId}' could not be found.", HttpStatusCode.NotFound);
            }

            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>.SuccessResponseWithoutData("Movie deleted successfully.", HttpStatusCode.NoContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while deleting movie with id '{movieId}'");
            response = ApiResponse<string>.ErrorResponse(ex.Message, HttpStatusCode.InternalServerError);
        }

        return response;
    }

    public async Task<ApiResponse<PaginationResponse<MovieListResponseDto>>> GetAllAsync(MovieFilterParameters filterParameters)
    {
        Expression<Func<Movie, bool>> filter = null;
        Expression<Func<Movie, object>> orderByColumn = null;
        Func<IQueryable<Movie>, IOrderedQueryable<Theatre>> orderBy = null;


        // Apply filtering
        if ((filterParameters.Category != null) || (filterParameters.Status != null) || !string.IsNullOrEmpty(filterParameters.SearchKeyword))
        {
            filter = query =>
                (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.Name.Contains(filterParameters.SearchKeyword)
                ) && (
                    (filterParameters.Category == null || filterParameters.Category == query.Category)
                ) && (
                    (filterParameters.Status == null || filterParameters.Status == query.Status)
                );
        }

        if (!string.IsNullOrEmpty(filterParameters.SortColumn))
        {
            switch (filterParameters.SortColumn.ToLower())
            {
                case "name":
                    orderByColumn = query => query.Name;
                    break;
                // Add more cases for other columns
                default:
                    throw new ArgumentException($"Invalid sort column: {filterParameters.SortColumn}");
            }
        }

        var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);

        var (query, totalItems) = await _unitOfWork.MovieRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);
        var movieResponse = await query.Select(
                                            mr => new MovieListResponseDto
                                            {
                                                Id = mr.Id,
                                                Name = mr.Name,
                                                NepaliName = mr.NepaliName,
                                                Category = mr.Category != null ? mr.Category.GetDisplayName() : eMovieCategory.None.GetDisplayName(),
                                                Status = mr.Status != null ? mr.Status.GetDisplayName() : eMovieStatus.Unknown.GetDisplayName(),
                                                Color = mr.Color != null ? mr.Color.GetDisplayName() : eMovieColor.None.GetDisplayName(),
                                                ThumbnailImageUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPath, mr.ThumbnailImage)
                                            }).ToListAsync();


        var response = new PaginationResponse<MovieListResponseDto>
        {
            Items = movieResponse,
            TotalItems = totalItems,
            PageNumber = filterParameters.PageNumber,
            PageSize = filterParameters.PageSize
        };

        return ApiResponse<PaginationResponse<MovieListResponseDto>>.SuccessResponse(response);
    }

    public async Task<ApiResponse<MovieResponseDto>> GetByIdAsync(int movieId)
    {
        var response = new ApiResponse<MovieResponseDto>();

        try
        {
            var movieEntity = await _unitOfWork.MovieRepository.GetMovieWithCrewDetails(movieId);
            if (movieEntity == null)
            {
                response.IsSuccess = false;
                response.Errors.Add($"Movie with id '{movieId}' could not be found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var movieResponse = _mapper.Map<MovieResponseDto>(movieEntity);
            movieResponse.Censor = _mapper.Map<MovieCensorDto>(movieEntity.Censor);

            movieResponse.Genres = movieEntity.MovieGenres.Select(g => new GenreDto
            {
                Id = g.GenreId,
                Name = g.Genre.Name
            }).ToList();
            movieResponse.Languages = movieEntity.MovieLanguages.Select(l => new LanguageDto
            {
                Id = l.LanguageId,
                Name = l.Language.Name
            }).ToList();

            movieResponse.ProductionHouses = movieEntity.MovieProductionHouses.Select(mvp => new ProductionHouseDto { Id = mvp.ProductionHouseId, Name = mvp.ProductionHouse.Name }).ToList();
            movieResponse.CrewRoles = MapToMovieCrewRoleDto(movieEntity.MovieCrewRoles.ToList());
            movieResponse.Theatres = MapMovieTheatres(movieEntity.MovieTheatres.ToList());

            var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);
                        
            movieResponse.ThumbnailImageUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPath, movieResponse.ThumbnailImage);
            movieResponse.CoverImageUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPath, movieResponse.CoverImage);

            response.IsSuccess = true;
            response.Data = movieResponse;
            response.StatusCode = HttpStatusCode.OK;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while retrieving movie with id '{movieId}'.");
            response.IsSuccess = false;
            response.Errors.Add($"An error occurred while retrieving movie with id '{movieId}'.");
            response.StatusCode = HttpStatusCode.InternalServerError;
        }

        return response;
    }

    private List<MovieTheatreDto> MapMovieTheatres(List<MovieTheatre> movieTheatres)
    {
        // Grouping the entities by ShowingDate
        var groupedEntities = movieTheatres.GroupBy(e => e.ShowingDate).ToList();

        var movieTheatreDtos = new List<MovieTheatreDto>();

        foreach (var group in groupedEntities)
        {
            var movieTheatreDto = new MovieTheatreDto
            {
                ShowingDate = group.Key,
                MovieTheatreDetails = group.Select(e => new TheatreDetailsDto
                {
                    Id = e.TheatreId,
                    Name = e.Theatre.Name,
                    Address = e.Theatre.Address
                }).ToList()
            };

            movieTheatreDtos.Add(movieTheatreDto);
        }

        return movieTheatreDtos;
    }

    private List<MovieCrewRoleDto> MapToMovieCrewRoleDto(List<MovieCrewRole> movieCrewRoles)
    {
        var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);
        var crewRolesDtos = new List<MovieCrewRoleDto>();
        var groupedByRole = movieCrewRoles
            .GroupBy(mcr => new
            {
                mcr.RoleId,
                mcr.FilmRole.RoleName,
            })
            .Select(group => new MovieCrewRoleDto
            {
                RoleId = group.Key.RoleId,
                RoleName = group.Key.RoleName,
                Crews = group.Select(mcr => mcr.Crew)
                            .Select(c => new CrewBasicDto
                            {
                                Id = c.Id,
                                Name = c.Name,
                                NepaliName = c.NepaliName,
                                NickName = c.NickName,
                                Email = "",//when email is added to the crew load it here
                                ThumbnailPhoto = c.ThumbnailPhoto,
                                ProfilePhoto = c.ProfilePhoto,
                                ProfilePhotoUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPath,c.ThumbnailPhoto),
                            })
                            .ToList()
            })
            .ToList();

        return groupedByRole;
    }

    public async Task<ApiResponse<string>> UpdateAsync(int movieId, MovieRequestDto movieRequestDto)
    {
        var response = new ApiResponse<string>();

        try
        {

            await _unitOfWork.BeginTransactionAsync();
            //string includeProperties = "MovieGenres,MovieTheatres,MovieProductionHouses,MovieCrewRoles,MovieLanguages,Censor";
            var existingMovie = await _unitOfWork.MovieRepository.GetMovieWithCrewDetails(movieId);


            if (existingMovie == null)
            {
                return ApiResponse<string>.ErrorResponse($"Movie with '{movieId}' could not be found.", HttpStatusCode.NotFound);
            }
            string movieNameBeforeMapping = existingMovie.Name;

            _mapper.Map(movieRequestDto, existingMovie);

            if (movieRequestDto.ThumbnailImageFile != null)
            {
                FileDTO fileDto = new FileDTO
                {
                    Files = movieRequestDto.ThumbnailImageFile,
                    Thumbnail = false,
                    ReadableName = true,
                    SubFolder = "movies"
                };
                var uploadResult = await _fileService.UploadFile(fileDto);
                if (uploadResult.IsSuccess && uploadResult.Data != null)
                {
                    // Delete existing image
                    if (!string.IsNullOrEmpty(existingMovie.ThumbnailImage))
                        _fileService.RemoveFile(existingMovie.ThumbnailImage, "movies");

                    existingMovie.ThumbnailImage = uploadResult.Data.FileName;
                }
            }

            if (movieRequestDto.CoverImageFile != null)
            {
                FileDTO fileDto = new FileDTO
                {
                    Files = movieRequestDto.CoverImageFile,
                    Thumbnail = false,
                    ReadableName = true,
                    SubFolder = "movies"
                };
                var uploadResult = await _fileService.UploadFile(fileDto);
                if (uploadResult.IsSuccess && uploadResult.Data != null)
                {
                    if (!string.IsNullOrEmpty(existingMovie.CoverImage))
                        _fileService.RemoveFile(existingMovie.CoverImage, "movies");

                    existingMovie.CoverImage = uploadResult.Data.FileName;
                }
            }

            if (movieRequestDto.Languages != null && movieRequestDto.Languages.Any())
            {
                existingMovie.MovieLanguages.Clear();
                foreach (var languageDto in movieRequestDto.Languages)
                {
                    var movieLanguageEntity = new MovieLanguage
                    {
                        Movie = existingMovie,
                        LanguageId = languageDto.Id
                    };
                    existingMovie.MovieLanguages.Add(movieLanguageEntity);
                }
            }

            if (movieRequestDto.Genres != null && movieRequestDto.Genres.Any())
            {
                existingMovie.MovieGenres.Clear();
                foreach (var genreDto in movieRequestDto.Genres)
                {
                    var movieLanguageEntity = new MovieGenre
                    {
                        Movie = existingMovie,
                        GenreId = genreDto.Id
                    };
                    existingMovie.MovieGenres.Add(movieLanguageEntity);
                }
            }

            if (movieRequestDto.ProductionHouses != null && movieRequestDto.ProductionHouses.Any())
            {
                existingMovie.MovieProductionHouses.Clear();
                foreach (var productionHouseDto in movieRequestDto.ProductionHouses)
                {
                    var movieProductionHouse = new MovieProductionHouse
                    {
                        Movie = existingMovie,
                        ProductionHouseId = productionHouseDto.Id
                    };
                    existingMovie.MovieProductionHouses.Add(movieProductionHouse);
                }
            }

            if (movieRequestDto.Theatres != null && movieRequestDto.Theatres.Any())
            {
                // Fetch existing MovieTheatres associated with the existingMovie
                var existingMovieTheatres = existingMovie.MovieTheatres.ToList();

                // Remove any unnecessary MovieTheatres
                foreach (var existingMovieTheatre in existingMovieTheatres)
                {
                    if (!movieRequestDto.Theatres.Any(td => td.MovieTheatreDetails.Any(mtd => mtd.Id == existingMovieTheatre.TheatreId)))
                    {
                        existingMovie.MovieTheatres.Remove(existingMovieTheatre);
                    }
                }

                // Update or add new MovieTheatres
                foreach (var theatreDto in movieRequestDto.Theatres)
                {
                    foreach (var theatreDetailDto in theatreDto.MovieTheatreDetails)
                    {
                        var existingMovieTheatre = existingMovieTheatres
                            .FirstOrDefault(mt => mt.TheatreId == theatreDetailDto.Id);

                        if (existingMovieTheatre != null)
                        {
                            // Update existing MovieTheatre if necessary
                            existingMovieTheatre.ShowingDate = theatreDto.ShowingDate;
                        }
                        else
                        {
                            var newMovieTheatre = new MovieTheatre
                            {
                                MovieId = existingMovie.Id,
                                TheatreId = theatreDetailDto.Id,
                                ShowingDate = theatreDto.ShowingDate,
                                Movie = existingMovie // Set the relationship
                            };
                            existingMovie.MovieTheatres.Add(newMovieTheatre);
                        }
                    }
                }
            }

            if (movieRequestDto.CrewRoles != null && movieRequestDto.CrewRoles.Any())
            {
                existingMovie.MovieCrewRoles.Clear();
                foreach (var crewRole in movieRequestDto.CrewRoles)
                {
                    foreach (var crew in crewRole.Crews)
                    {
                        var crewRoleEntity = new MovieCrewRole
                        {
                            CrewId = crew.Id,
                            RoleId = crewRole.RoleId
                        };

                        existingMovie.MovieCrewRoles.Add(crewRoleEntity);
                    }
                }
            }

            if (movieRequestDto.Censor != null)
            {
                var existingCensor = existingMovie.Censor;

                if (existingCensor == null)
                {
                    var newCensor = _mapper.Map<MovieCensor>(movieRequestDto.Censor);
                    newCensor.MovieId = existingMovie.Id;
                    existingMovie.Censor = newCensor;
                }
                else
                {
                    _mapper.Map(movieRequestDto.Censor, existingCensor);
                }
            }

            existingMovie.UpdatedBy = movieRequestDto.AuditedBy;

            await _unitOfWork.MovieRepository.UpdateAsync(existingMovie);
            await _unitOfWork.CommitAsync();

            response = ApiResponse<string>.SuccessResponseWithoutData($"The movie '{movieNameBeforeMapping}' was updated successfully.", HttpStatusCode.OK);
        }
        catch (Exception ex)
        {
            _unitOfWork.Rollback();
            _logger.LogError(ex, "An error occurred while updating the movie.");
            response = ApiResponse<string>.ErrorResponse(new List<string> { ex.Message }, HttpStatusCode.InternalServerError);
        }

        return response;
    }

    public async Task<ApiResponse<List<LanguageListResponseDto>>> GetAllLanguages()
    {
        var languages = await _unitOfWork.MovieRepository.GetAllLanguages();
        var languagesDto = _mapper.Map<List<LanguageListResponseDto>>(languages);
        return ApiResponse<List<LanguageListResponseDto>>.SuccessResponse(languagesDto);
    }

    public async Task<ApiResponse<List<GenresListResponseDto>>> GetAllGenres()
    {
        var genres = await _unitOfWork.MovieRepository.GetAllGenres();
        var genresDto = _mapper.Map<List<GenresListResponseDto>>(genres);
        return ApiResponse<List<GenresListResponseDto>>.SuccessResponse(genresDto);
    }
}
