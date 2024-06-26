﻿using Application.Dtos.FilterParameters;
using Application.Dtos;
using Application.Interfaces.Services;
using Core.Constants;
using Core;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace nmdb.Controllers;

[ApiController]
[Authorize]
[RequiredRoles(AuthorizationConstants.AdminRole)]
[Route("api/cards")]
public class CardRequestController : AuthorizedController
{
    private readonly ILogger<CrewController> _logger;
    private readonly ICardRequestService _cardRequestService;
    private readonly ICrewService _crewService;
    private readonly UserManager<ApplicationUser> _userManager;

    public CardRequestController(ILogger<CrewController> logger,
        ICardRequestService cardRequestService,
        UserManager<ApplicationUser> userManager,
        ICrewService crewService)
    {
        _logger = logger;
        _cardRequestService = cardRequestService;
        _userManager = userManager;
        _crewService = crewService;
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
            return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
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
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));

        }
    }

    [HttpPost("request")]
    [RequiredRoles(AuthorizationConstants.CrewRole)]
    public async Task<IActionResult> RequestCard()
    {
        try
        {
            if (!string.IsNullOrEmpty(CurrentUser.ID))
            {
                var currentUserEmail = CurrentUser.Email;
                if (string.IsNullOrEmpty(currentUserEmail))
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid card data.", HttpStatusCode.BadRequest));
                }

                var result = await _cardRequestService.RequestCardAsync(currentUserEmail);

                if (result.IsSuccess)
                {
                    return Ok(result);
                }
                else if (!result.IsSuccess && result.StatusCode == HttpStatusCode.NotFound)
                {
                    return NotFound(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            return NotFound(ApiResponse<string>.ErrorResponse("The crew cannot be found in the session. Try again after logging in again.", HttpStatusCode.NotFound));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));

        }
    }

    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> ApproveCardRequest(int id)
    {
        try
        {
            var result = await _cardRequestService.ApproveCardRequestAsync(id, GetUserEmail);

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
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
        }
    }
}
