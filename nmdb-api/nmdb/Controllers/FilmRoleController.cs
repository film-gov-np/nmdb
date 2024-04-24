using Application.CQRS.FilmRoles.Queries;
using Application.Dtos;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Services;
using Azure.Core;
using Core.Constants;
using Core.Entities;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nmdb.Common;
using System.Linq.Expressions;
using System.Security.Claims;
using static Dapper.SqlMapper;

namespace nmdb.Controllers;

[ApiController]
[Route("api/film/")]
public class FilmRoleController : AuthorizedController
{
    private readonly ILogger<FilmRoleController> _logger;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IFilmRoleService _filmRoleService;
    private readonly IUnitOfWork _unitOfWork;
    public FilmRoleController(ILogger<FilmRoleController> logger, IHttpContextAccessor contextAccessor,IFilmRoleService filmRoleService, IUnitOfWork unitOfWork)
    {
        _logger = logger;
        _contextAccessor = contextAccessor;
        _filmRoleService = filmRoleService;
        _unitOfWork = unitOfWork;   
    }

    [HttpGet("roles")]
    [Authorize(Roles = AuthorizationConstants.AdminRole)]
    public async Task<IActionResult> GetFilmRoles([FromQuery] FilmRoleFilterParameters filterParameters)
    {
        var response = await _filmRoleService.GetAll(filterParameters);        
        return Ok(response);
    }

    [HttpPost("role")]
    public async Task<object> AddFilmRoles()
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();
            FilmRole filmRole = new()
            {
                RoleName = "another test role",
                RoleCategoryId = 1,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "test"
            };
            await _unitOfWork.FilmRoleRepository.AddAsync(filmRole);
            await _unitOfWork.CommitAsync();
            return new { Success = true };
        }
        catch (Exception ex)
        {
            _unitOfWork.Rollback();
            return new { Success = false };

        }
    }
}
