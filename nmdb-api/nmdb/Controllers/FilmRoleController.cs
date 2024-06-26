using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Interfaces.Services;
using Core;
using Core.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;
using System.Net;

namespace nmdb.Controllers;

[ApiController]
[Authorize]
[RequiredRoles(AuthorizationConstants.AdminRole)]
[Route("api/film-roles/")]
public class FilmRoleController : AuthorizedController
{
    private readonly ILogger<FilmRoleController> _logger;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IFilmRoleService _filmRoleService;
    public FilmRoleController(ILogger<FilmRoleController> logger, IHttpContextAccessor contextAccessor, IFilmRoleService filmRoleService)
    {
        _logger = logger;
        _contextAccessor = contextAccessor;
        _filmRoleService = filmRoleService;
    }

    [HttpGet]    
    public async Task<IActionResult> GetAll([FromQuery] FilmRoleFilterParameters filterParameters)
    {
        var response = await _filmRoleService.GetAllAsync(filterParameters);
        return Ok(response);
    }

    [HttpGet("{id}")]    
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _filmRoleService.GetByIdAsync(id);

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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] FilmRoleRequest filmRoleDto)
    {
        if (filmRoleDto == null)
        {
            return BadRequest(ApiResponse<FilmRoleRequest>.ErrorResponse("Invalid film role data.", HttpStatusCode.BadRequest));
        }

        var result = await _filmRoleService.CreateAsync(filmRoleDto);

        if (result.IsSuccess)
        {
            return Ok(result);
        }
        else
        {
            return BadRequest(result);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] FilmRoleRequest filmRoleDto)
    {
        var result = await _filmRoleService.UpdateAsync(id, filmRoleDto);

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

    [HttpPatch("{id}/display-order")]
    public async Task<IActionResult> UpdateFilmRoleDisplayOrder(int id, [FromBody] int displayOrder)
    {
        var result = await _filmRoleService.UpdateDisplayOrderAsync(id, displayOrder);

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

    [HttpDelete("role/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _filmRoleService.DeleteByIdAsync(id);

        if (result.IsSuccess)
        {
            return Ok(result);
        }
        else if (result.StatusCode == HttpStatusCode.NotFound)
        {
            return NotFound(result);
        }
        else
            return BadRequest(result);

    }
}
