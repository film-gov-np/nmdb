using Application.CQRS.FilmRoles.Queries;
using Application.Dtos;
using Application.Dtos.Awards;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Dtos.Movie;
using Application.Helpers;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Models;
using AutoMapper;
using Core;
using Core.Constants;
using Core.Entities;
using Core.Entities.Awards;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AwardsService : IAwardsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<AwardsService> _logger;
        public AwardsService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<AwardsService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }
        public async Task<ApiResponse<PaginationResponse<AwardsListDto>>> GetAllAsync(AwardsFilterParameters filterParameters)
        {
            Expression<Func<Awards, bool>> filter = null;
            Expression<Func<Awards, object>> orderByColumn = null;
            Func<IQueryable<Awards>, IOrderedQueryable<Awards>> orderBy = null;


            var (query, totalItems) = await _unitOfWork.AwardsRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);
            var awardResponse = await query.Where(q => !q.IsDeleted).Select(
                                                tr => new AwardsListDto
                                                {
                                                    Id = tr.Id,
                                                    AwardTitle = tr.AwardTitle,
                                                    CategoryName = tr.CategoryName,
                                                    AwardStatus = tr.AwardStatus,
                                                    AwardedIn = tr.AwardedIn,
                                                    AwardedDate = tr.AwardedDate,
                                                    Remarks = tr.Remarks,
                                                }).ToListAsync();

            var response = new PaginationResponse<AwardsListDto>
            {
                Items = awardResponse,
                TotalItems = totalItems,
                PageNumber = filterParameters.PageNumber,
                PageSize = filterParameters.PageSize
            };

            return ApiResponse<PaginationResponse<AwardsListDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<string>> CreateAwardsAsync(AwardsRequestDto requestDto)
        {
            try
            {
                var award = _mapper.Map<Awards>(requestDto);
                await _unitOfWork.AwardsRepository.AddAsync(award);
                await _unitOfWork.CommitAsync();
                return ApiResponse<string>.SuccessResponseWithoutData("Award created successfully.", HttpStatusCode.Created);
            }
            catch (AppException ex)
            {
                _logger.LogError(ex, "An error occurred while creating the award.");
                return ApiResponse<string>.ErrorResponse
                (
                    new List<string> { "An error occurred while creating the award." },
                    HttpStatusCode.InternalServerError
                );
            }
        }

        public async Task<ApiResponse<string>> UpdateAwardsAsync(int awardId, AwardsRequestDto requestDto)
        {
            var response = new ApiResponse<string>();

            try
            {
                var award = await _unitOfWork.AwardsRepository.GetByIdAsync(awardId);

                if (award == null)
                {
                    return ApiResponse<string>.ErrorResponse("Award not found.", HttpStatusCode.NotFound);
                }

                _mapper.Map(requestDto, award);
                award.Id = awardId;
                await _unitOfWork.AwardsRepository.UpdateAsync(award);
                await _unitOfWork.CommitAsync();

                response = ApiResponse<string>
                    .SuccessResponseWithoutData("Award updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating a award.");
                response = ApiResponse<string>.ErrorResponse(new List<string> { ex.Message }, HttpStatusCode.InternalServerError);
            }

            return response;
        }

        public async Task<ApiResponse<string>> DeleteAwardsAsync(int awardId, string deletedBy)
        {
            var response = new ApiResponse<string>();
            try
            {
                var award = await _unitOfWork.AwardsRepository.GetByIdAsync(awardId);

                if (award == null)
                {
                    return ApiResponse<string>.ErrorResponse("Award not found.", HttpStatusCode.NotFound);
                }
                award.IsDeleted = true;
                award.UpdatedBy = deletedBy;
                award.UpdatedAt = DateTime.Now;
                await _unitOfWork.AwardsRepository.UpdateAsync(award);
                await _unitOfWork.CommitAsync();

                response = ApiResponse<string>.SuccessResponseWithoutData("Award deleted successfully.", HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting a award.");
                response = ApiResponse<string>.ErrorResponse(ex.Message, HttpStatusCode.InternalServerError);
            }

            return response;
        }

        public async Task<ApiResponse<AwardsResponseDto>> GetAwardsByIdAsync(int awardId)
        {
            var response = new ApiResponse<AwardsResponseDto>();

            try
            {
                var award = await _unitOfWork.AwardsRepository.Get(a => a.Id == awardId)
                                    .Select(a => new AwardsResponseDto
                                    {
                                        Id = a.Id,
                                        CategoryName = a.CategoryName,
                                        AwardTitle = a.AwardTitle,
                                        AwardedDate = a.AwardedDate,
                                        AwardedIn = a.AwardedIn,
                                        AwardStatus = a.AwardStatus,
                                        Remarks = a.Remarks,
                                        Movie = a.Movie != null ? new MovieListResponseDto
                                        {
                                            Id = a.Movie.Id,
                                            Name = a.Movie.Name,
                                            NepaliName = a.Movie.NepaliName,
                                            Category = a.Movie.Category != null ? a.Movie.Category.GetDisplayName() : eMovieCategory.None.GetDisplayName(),
                                            Status = a.Movie.Status != null ? a.Movie.Status.GetDisplayName() : eMovieStatus.Unknown.GetDisplayName(),
                                            Color = a.Movie.Color != null ? a.Movie.Color.GetDisplayName() : eMovieColor.None.GetDisplayName()
                                        } : null
                                    }).FirstOrDefaultAsync();

                if (award == null)
                {
                    response.IsSuccess = false;
                    response.Errors.Add("Award not found.");
                    response.StatusCode = HttpStatusCode.NotFound;
                    return response;
                }

                var awardResponse = _mapper.Map<AwardsResponseDto>(award);

                response.IsSuccess = true;
                response.Data = awardResponse;
                response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving award.");
                response.IsSuccess = false;
                response.Errors.Add("An error occurred while processing the request.");
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }


    }
}
