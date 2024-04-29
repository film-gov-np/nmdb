using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services;

public interface IFilmRoleService
{
    Task<ApiResponse<FilmRoleDto>> CreateAsync(FilmRoleDto filmRoleDto);
    Task<ApiResponse<FilmRoleDto>> UpdateAsync(int Id, FilmRoleDto filmRoleDto);
    Task<ApiResponse<FilmRoleDto>> UpdateDisplayOrderAsync(int roleId, int displayOrder);
    Task<ApiResponse<FilmRoleResponse>> GetByIdAsync(int roleId);
    Task<ApiResponse<string>> DeleteByIdAsync(int roleId);
    Task<ApiResponse<PaginationResponse<FilmRoleResponse>>> GetAllAsync(FilmRoleFilterParameters filterParameters);
}
