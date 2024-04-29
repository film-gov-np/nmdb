using Application.Interfaces.Services;
using Core.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;

namespace nmdb.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/film/")]
public class FilmRoleCategoryController : ControllerBase
{
    private readonly IFilmRoleCategoryService _filmRoleCategoryService;

    public FilmRoleCategoryController(IFilmRoleCategoryService filmRoleCategoryService)
    {
        _filmRoleCategoryService = filmRoleCategoryService;
    }

    [AllowAnonymous]
    [HttpGet("role-categories")]
    public async Task<IActionResult> GetAll()
    {
        var filmRoleCategories = await _filmRoleCategoryService.GetAllAsync();
        return Ok(filmRoleCategories);
    }
}
