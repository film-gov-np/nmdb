using Application.Dtos.FilterParameters;
using Application.Dtos.Movie;
using Application.Dtos.Theatre;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Validators;
using AutoMapper;
using Core;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
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

    public MovieService(IMapper mapper, ILogger<MovieService> logger, IUnitOfWork unitOfWork)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _logger = logger;
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
            var createdMovie = await _unitOfWork.MovieRepository.AddAsync(movieEntity);

            if (movieRequestDto.CrewRoles != null && movieRequestDto.CrewRoles.Any())
            {
                //var crewRoleEntities = _mapper.Map<List<MovieCrewRole>>(movieRequestDto.CrewRoles);
                foreach (var crewRole in movieRequestDto.CrewRoles)
                {
                    foreach (var crew in crewRole.Crews)
                    {
                        var crewRoleEntity = new MovieCrewRole
                        {
                            //MovieId = createdMovie.Id,
                            CrewId = crew.CrewId,
                            RoleId = crewRole.RoleId,
                            RoleNickName = crewRole.RoleNickName,
                            RoleNickNameNepali = crewRole.RoleNickNameNepali
                        };

                        movieEntity.MovieCrewRoles.Add(crewRoleEntity);
                    }
                }
            }

            if (movieRequestDto.Theatres != null && movieRequestDto.Theatres.Any())
            {
                foreach (var movie in movieRequestDto.Theatres)
                {
                    var theatreEntity = new MovieTheatre
                    {
                        TheatreId = movie.TheatreId,
                        ShowingDate = movie.ShowingDate,
                    };
                    movieEntity.MovieTheatres.Add(theatreEntity);
                }
            }

            if (movieRequestDto.ProductionHouseIds != null && movieRequestDto.ProductionHouseIds.Any())
            {
                //var productionHouseEntities = _mapper.Map<List<MovieProductionHouse>>(movieRequestDto.ProductionHouses);
                foreach (var productionHouseId in movieRequestDto.ProductionHouseIds)
                {
                    var productionHouseEntity = new MovieProductionHouse
                    {
                        Movie = movieEntity,
                        ProductionHouseId = productionHouseId
                    };
                    movieEntity.MovieProductionHouses.Add(productionHouseEntity);
                }
            }

            if (movieRequestDto.Censor != null)
            {
                var censorEntity = _mapper.Map<MovieCensor>(movieRequestDto.Censor);
                movieEntity.Censor = censorEntity;
            }

            if (movieRequestDto.LanguageIds != null && movieRequestDto.LanguageIds.Any())
            {
                foreach (var languageId in movieRequestDto.LanguageIds)
                {
                    var movieLanguageEntity = new MovieLanguage
                    {
                        Movie = movieEntity,
                        LanguageId = languageId
                    };
                    movieEntity.MovieLanguages.Add(movieLanguageEntity);
                }
            }

            if (movieRequestDto.GenreIds != null && movieRequestDto.GenreIds.Any())
            {
                foreach (var genreId in movieRequestDto.GenreIds)
                {
                    var movieGenreEntity = new MovieGenre
                    {
                        Movie = movieEntity,
                        GenreId = genreId
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
        if (!string.IsNullOrEmpty(filterParameters.SearchKeyword))
        {
            filter = query =>
                (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.Name.Contains(filterParameters.SearchKeyword)
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

        var (query, totalItems) = await _unitOfWork.MovieRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);
        var movieResponse = await query.Select(
                                            mr => new MovieListResponseDto
                                            {
                                                Id = mr.Id,
                                                Name = mr.Name,
                                                NepaliName = mr.NepaliName,
                                                Category = mr.Category.GetDisplayName(),
                                                Status = mr.Status.GetDisplayName(),
                                                Image = mr.Image

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
            //string includeProperties = "MovieTheatres,MovieGenres,MovieLanguages,MovieCrewRoles,MovieProductionHouses,Censor";

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
            movieResponse.GenreIds = movieEntity.MovieGenres.Select(g => g.GenreId).ToList();
            movieResponse.LanguageIds = movieEntity.MovieLanguages.Select(l => l.LanguageId).ToList();
            movieResponse.ProductionHouseIds = movieEntity.MovieProductionHouses.Select(mvp => mvp.ProductionHouseId).ToList();
            movieResponse.CrewRoles = MapToMovieCrewRoleDto(movieEntity.MovieCrewRoles.ToList());
            movieResponse.Theatres = MapMovieTheatres(movieEntity.MovieTheatres.ToList());// _mapper.Map<List<MovieTheatreDto>>(movieEntity.MovieTheatres);


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
        var movieTheatresDto = new List<MovieTheatreDto>();
        foreach (var theatre in movieTheatres)
        {
            movieTheatresDto.Add(new MovieTheatreDto()
            {
                TheatreId = theatre.TheatreId,
                Name = theatre.Theatre.Name,
                Address = theatre.Theatre.Address,
                ShowingDate = theatre.ShowingDate
            });
        }

        return movieTheatresDto;
    }

    private List<MovieCrewRoleDto> MapToMovieCrewRoleDto(List<MovieCrewRole> movieCrewRoles)
    {
        var crewRolesDtos = new List<MovieCrewRoleDto>();
        var groupedByRole = movieCrewRoles
            .GroupBy(mcr => new { mcr.RoleId, mcr.RoleNickName, mcr.RoleNickNameNepali })
            .Select(group => new MovieCrewRoleDto
            {
                RoleId = group.Key.RoleId,
                RoleNickName = group.Key.RoleNickName,
                RoleNickNameNepali = group.Key.RoleNickNameNepali,
                Crews = group.Select(mcr => mcr.Crew)
                            .Select(c => new CrewBasicDto
                            {
                                CrewId = c.Id,
                                Name = c.Name
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
            string includeProperties = "MovieGenres,MovieTheatres,MovieProductionHouses,MovieCrewRoles,MovieLanguages,Censor";
            var existingMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId, includeProperties);

            if (existingMovie == null)
            {
                return ApiResponse<string>.ErrorResponse($"Movie with '{movieId}' could not be found.", HttpStatusCode.NotFound);
            }

            _mapper.Map(movieRequestDto, existingMovie);

            if (movieRequestDto.LanguageIds != null && movieRequestDto.LanguageIds.Any())
            {
                existingMovie.MovieLanguages.Clear();
                foreach (var languageId in movieRequestDto.LanguageIds)
                {
                    var movieLanguageEntity = new MovieLanguage
                    {
                        Movie = existingMovie,
                        LanguageId = languageId
                    };
                    existingMovie.MovieLanguages.Add(movieLanguageEntity);
                }
            }

            if (movieRequestDto.GenreIds != null && movieRequestDto.GenreIds.Any())
            {
                existingMovie.MovieGenres.Clear();
                foreach (var genreId in movieRequestDto.GenreIds)
                {
                    var movieLanguageEntity = new MovieGenre
                    {
                        Movie = existingMovie,
                        GenreId = genreId
                    };
                    existingMovie.MovieGenres.Add(movieLanguageEntity);
                }
            }

            if (movieRequestDto.ProductionHouseIds != null && movieRequestDto.ProductionHouseIds.Any())
            {
                existingMovie.MovieProductionHouses.Clear();
                foreach (var productionHouseId in movieRequestDto.ProductionHouseIds)
                {
                    var movieProductionHouse = new MovieProductionHouse
                    {
                        Movie = existingMovie,
                        ProductionHouseId = productionHouseId
                    };
                    existingMovie.MovieProductionHouses.Add(movieProductionHouse);
                }
            }

            if (movieRequestDto.Theatres != null && movieRequestDto.Theatres.Any())
            {
                // Fetch existing MovieTheatres associated with the existingMovie
                var existingMovieTheatres = existingMovie.MovieTheatres.ToList();

                // Update or add new MovieTheatres
                foreach (var theatreDto in movieRequestDto.Theatres)
                {
                    var existingMovieTheatre = existingMovieTheatres.FirstOrDefault(mt => mt.TheatreId == theatreDto.TheatreId);

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
                            TheatreId = theatreDto.TheatreId,
                            ShowingDate = theatreDto.ShowingDate
                        };
                        existingMovie.MovieTheatres.Add(newMovieTheatre);
                    }
                }

                // Remove any unnecessary MovieTheatres
                foreach (var existingMovieTheatre in existingMovieTheatres)
                {
                    if (!movieRequestDto.Theatres.Any(td => td.TheatreId == existingMovieTheatre.TheatreId))
                    {
                        existingMovie.MovieTheatres.Remove(existingMovieTheatre);
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
                            CrewId = crew.CrewId,
                            RoleId = crewRole.RoleId,
                            RoleNickName = crewRole.RoleNickName,
                            RoleNickNameNepali = crewRole.RoleNickNameNepali
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

            response = ApiResponse<string>.SuccessResponseWithoutData($"The movie '{movieRequestDto.Name}' was created successfully.", HttpStatusCode.Created);
        }
        catch (Exception ex)
        {
            _unitOfWork.Rollback();
            _logger.LogError(ex, "An error occurred while updating the movie.");
            response = ApiResponse<string>.ErrorResponse(new List<string> { ex.Message }, HttpStatusCode.InternalServerError);
        }

        return response;
    }
}
