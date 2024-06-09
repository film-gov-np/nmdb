using Application.CQRS.FilmRoles.Queries;
using Application.Dtos;
using Application.Dtos.Awards;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Models;
using AutoMapper;
using Core;
using Core.Entities;
using Core.Entities.Awards;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
            var theatreResponse = await query.Select(
                                                tr => new AwardsListDto
                                                {
                                                    Id = tr.Id,
                                                    Name = tr.AwardTitle,
                                                }).ToListAsync();

            var response = new PaginationResponse<AwardsListDto>
            {
                Items = theatreResponse,
                TotalItems = totalItems,
                PageNumber = filterParameters.PageNumber,
                PageSize = filterParameters.PageSize
            };

            return ApiResponse<PaginationResponse<AwardsListDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<string>> CreateAwardsAsync(AwardsRequestDto crewRequestDto)
        {
            try
            {
                var filmRole = _mapper.Map<Awards>(crewRequestDto);
                await _unitOfWork.AwardsRepository.AddAsync(filmRole);
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

        public async Task<ApiResponse<string>> UpdateAwardsAsync(int awardId, AwardsRequestDto crewRequestDto)
        {
            var response = new ApiResponse<string>();

            try
            {
                var award = await _unitOfWork.AwardsRepository.GetByIdAsync(awardId);

                if (award == null)
                {
                    return ApiResponse<string>.ErrorResponse("Award not found.", HttpStatusCode.NotFound);
                }

                _mapper.Map(crewRequestDto, award);
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

        public async Task<ApiResponse<string>> DeleteAwardsAsync(int awardId)
        {
            var response = new ApiResponse<string>();
            try
            {
                var deleteResult = await _unitOfWork.AwardsRepository.DeleteAsync(awardId);

                if (!deleteResult)
                {
                    return ApiResponse<string>.ErrorResponse("Award not found.", HttpStatusCode.NotFound);
                }

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
                var award = await _unitOfWork.AwardsRepository.GetByIdAsync(awardId);

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
                _logger.LogError(ex, "An error occurred while retrieving a award.");
                response.IsSuccess = false;
                response.Errors.Add("An error occurred while processing the request.");
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }


    }
}
