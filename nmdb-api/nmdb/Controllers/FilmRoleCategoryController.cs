using Application.Interfaces.Services;
using Core.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;

namespace nmdb.Controllers;

[ApiController]
[RequiredRoles(AuthorizationConstants.AdminRole)]
[Route("api/film/")]
public class FilmRoleCategoryController : ControllerBase
{
    private readonly IFilmRoleCategoryService _filmRoleCategoryService;

    public FilmRoleCategoryController(IFilmRoleCategoryService filmRoleCategoryService)
    {
        _filmRoleCategoryService = filmRoleCategoryService;
    }

    
    [HttpGet("role-categories")]
    public async Task<IActionResult> GetAll()
    {
        var filmRoleCategories = await _filmRoleCategoryService.GetAllAsync();
        return Ok(filmRoleCategories);
    }
}
