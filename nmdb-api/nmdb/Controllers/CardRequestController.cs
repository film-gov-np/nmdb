using Application.Dtos.FilterParameters;
using Application.Dtos;
using Application.Interfaces.Services;
using Core.Constants;
using Core;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;
using System.Net;
using Microsoft.AspNetCore.Authorization;

namespace nmdb.Controllers;

[ApiController]
[Authorize]
[RequiredRoles(AuthorizationConstants.AdminRole, AuthorizationConstants.UserRole)]
[Route("api/cards")]
public class CardRequestController : AuthorizedController
{
    private readonly ILogger<CrewController> _logger;
    private readonly ICardRequestService _cardRequestService;

    public CardRequestController(ILogger<CrewController> logger, ICardRequestService cardRequestService)
    {
        _logger = logger;
        _cardRequestService = cardRequestService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] CardRequestFilterParameters filterParameters)
    {
        try
        {
            var response = await _cardRequestService.GetAllAsync(filterParameters);
            return Ok(response);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _cardRequestService.GetByIdAsync(id);

        if (result.IsSuccess)
        {
            return Ok(result);
        }
        else if (result.StatusCode == HttpStatusCode.NotFound)
        {
            return NotFound(result);
        }
        else
        {
            return BadRequest(result);
        }
    }

    [HttpPost("{crewId}/request")]
    public async Task<IActionResult> RequestCard(int crewId)
    {
        try
        {
            if (crewId == null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid card data.", HttpStatusCode.BadRequest));
            }
                        
            var result = await _cardRequestService.RequestCardAsync(crewId);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> ApproveCardRequest(int id, [FromBody] CardRequestDto cardRequestDto)
    {
        if (cardRequestDto == null)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse("Invalid crew data.", HttpStatusCode.BadRequest));
        }
        cardRequestDto.Authorship = GetUserEmail;
        var result = await _cardRequestService.ApproveCardRequestAsync(id, cardRequestDto);

        if (result.IsSuccess)
        {
            return Ok(result);
        }
        else if (result.StatusCode == HttpStatusCode.NotFound)
        {
            return NotFound(result);
        }
        else
        {
            return BadRequest(result);
        }
    }
}
