using Application.Abstractions;
using Application.CQRS.FilmRoles.Queries;
using Application.Dtos;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Models;
using Azure;
using Azure.Core;
using Core;
using Core.Constants;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Application.Services
{
    public class CardRequestService : ICardRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;
        private readonly ICrewService _crewService;
        private readonly ILogger<CardRequestService> _logger;
        public CardRequestService(
            IUnitOfWork unitOfWork,
            IEmailService emailService,
            ICrewService crewService,
            ILogger<CardRequestService> logger)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _crewService = crewService;
            _logger = logger;
        }
        public async Task<ApiResponse<string>> RequestCardAsync(int crewId)
        {
            var response = new ApiResponse<string>();

            try
            {
                _unitOfWork.BeginTransactionAsync();
                var crewEntity = await _unitOfWork.CrewRepository.GetByIdAsync(crewId);

                if (crewEntity != null)
                {
                    if (crewEntity.HasRequestedCard.HasValue && crewEntity.HasRequestedCard.Value)
                    {
                        return ApiResponse<string>.ErrorResponse("You have already requested a card.", HttpStatusCode.NotModified);
                    }
                    var request = new CardRequest
                    {
                        CrewId = crewId,
                        CreatedAt = DateTime.UtcNow,
                        IsApproved = false
                    };
                    await _unitOfWork.CardRequestRepository.AddAsync(request);
                    crewEntity.HasRequestedCard = true;
                    await _unitOfWork.CrewRepository.UpdateAsync(crewEntity);

                    await _unitOfWork.CommitAsync();

                    await _emailService.Send(
                        "test@nmdb.com", // admin or info email
                        "Card Requested",
                        EmailTemplate.CardRequested.Replace("{{crew}}", crewEntity.Email)
                        );

                    response.IsSuccess = true;
                    response.Message = $"Card requested succesfully";                    
                }
                else
                {
                    response.IsSuccess = false;
                    response.Message = $"Crew with id {crewId} does not exist.";
                    response.StatusCode = HttpStatusCode.NotFound;
                }
            }
            catch (Exception ex)
            {
                _unitOfWork.Rollback();
                _logger.LogError(ex, "An error occurred while requesting card.");
                response.IsSuccess = false;
                response.Errors.Add("An error occurred while processing the request.");
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }

        public async Task<ApiResponse<string>> ApproveCardRequestAsync(int cardId, CardRequestDto cardRequestDto)
        {
            try
            {

                var cardRequest = await _unitOfWork.CardRequestRepository.GetByIdAsync(cardId);
                if (cardRequest == null)
                {
                    return ApiResponse<string>.ErrorResponse("Card request not found.", HttpStatusCode.NotFound);
                    //throw new InvalidOperationException("Card Request not found.");
                }
                cardRequest.IsApproved = true;
                cardRequest.ApprovedDate = DateTime.UtcNow;
                cardRequest.ReadyDate = cardRequest.ApprovedDate.Value.AddDays(14); // Set ready date 2 weeks after the approved date
                cardRequest.UpdatedAt = DateTime.UtcNow;
                cardRequest.UpdatedBy = cardRequestDto.Authorship;

                await _unitOfWork.CardRequestRepository.UpdateAsync(cardRequest);
                await _unitOfWork.CommitAsync();

                var crew = await _crewService.GetCrewByIdAsync(cardRequest.CrewId);
                if (!crew.IsSuccess)
                    return ApiResponse<string>.ErrorResponse(crew.Message);

                await _emailService.Send(crew.Data.Email, "Card Approved", EmailTemplate.CardApproved.Replace("{{ready-date}}", cardRequest.ReadyDate.Value.Date.ToString()));
                return ApiResponse<string>.SuccessResponseWithoutData("Card approved succesfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while approving the card request.");
                return ApiResponse<string>.ErrorResponse(ex.Message);
            }
        }

        public async Task<ApiResponse<PaginationResponse<CardRequestDto>>> GetAllAsync(CardRequestFilterParameters filterParameters)
        {
            Expression<Func<CardRequest, bool>> filter = null;
            Expression<Func<CardRequest, object>> orderByColumn = null;
            Func<IQueryable<CardRequest>, IOrderedQueryable<Crew>> orderBy = null;


            // Apply filtering
            if (!string.IsNullOrEmpty(filterParameters.SearchKeyword) || filterParameters.IsApproved != null)
            {
                filter = query =>
                    (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.Crew.Name.Contains(filterParameters.SearchKeyword)
                    || query.Crew.Email.Contains(filterParameters.SearchKeyword))
                    &&
                    (!filterParameters.IsApproved == null || query.IsApproved == filterParameters.IsApproved);
            }

            filterParameters.IncludeProperties = "Crew";

            if (!string.IsNullOrEmpty(filterParameters.SortColumn))
            {
                switch (filterParameters.SortColumn.ToLower())
                {
                    case "CreatedAt":
                        orderByColumn = query => query.CreatedAt;
                        break;
                    // Add more cases for other columns
                    default:
                        throw new ArgumentException($"Invalid sort column: {filterParameters.SortColumn}");
                }
            }

            var (query, totalItems) = await _unitOfWork.CardRequestRepository.GetWithFilter(filterParameters, filterExpression: filter, orderByColumnExpression: orderByColumn);
            var cardRequestResponse = await query.Select(
                                                tr => new CardRequestDto
                                                {
                                                    Id = tr.Id,
                                                    ApprovedDate = tr.ApprovedDate,
                                                    ReadyDate = tr.ReadyDate,
                                                    IsApproved = tr.IsApproved,
                                                    Crew = new CrewCardBasicDto
                                                    {
                                                        Id = tr.Crew.Id,
                                                        Name = tr.Crew.Name,
                                                        Email = tr.Crew.Email
                                                    }
                                                }).ToListAsync();

            var response = new PaginationResponse<CardRequestDto>
            {
                Items = cardRequestResponse,
                TotalItems = totalItems,
                PageNumber = filterParameters.PageNumber,
                PageSize = filterParameters.PageSize
            };

            return ApiResponse<PaginationResponse<CardRequestDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<CardRequestDto>> GetByIdAsync(int cardId)
        {
            var response = new ApiResponse<CardRequestDto>();

            try
            {
                var cardRequestResult = await _unitOfWork.CardRequestRepository.GetByIdAsync(cardId, "Crew");

                if (cardRequestResult == null)
                {
                    response.IsSuccess = false;
                    response.Errors.Add("Card request not found.");
                    response.StatusCode = HttpStatusCode.NotFound;
                    return response;
                }

                var cardResponse = new CardRequestDto
                {
                    Id = cardId,
                    Crew = new CrewCardBasicDto
                    {
                        Name = cardRequestResult.Crew.Name,
                        Email = cardRequestResult.Crew.Email,
                        Id = cardRequestResult.Crew.Id
                    },
                    IsApproved = cardRequestResult.IsApproved,
                    ApprovedDate = cardRequestResult.ApprovedDate,
                    ReadyDate = cardRequestResult.ApprovedDate
                };

                response.IsSuccess = true;
                response.Data = cardResponse;
                response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving the card.");
                response.IsSuccess = false;
                response.Errors.AddRange(new List<string> {
                    "An error occurred while processing the request.",
                    ex.Message.ToString()});
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }
    }
}
