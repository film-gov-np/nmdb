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
    Task<ApiResponse<string>> CreateAsync(FilmRoleRequest filmRoleDto);
    Task<ApiResponse<string>> UpdateAsync(int Id, FilmRoleRequest filmRoleDto);
    Task<ApiResponse<string>> UpdateDisplayOrderAsync(int roleId, int displayOrder);
    Task<ApiResponse<string>> DeleteByIdAsync(int roleId);


    Task<ApiResponse<FilmRoleResponseDto>> GetByIdAsync(int roleId);
    Task<ApiResponse<PaginationResponse<FilmRoleResponseDto>>> GetAllAsync(FilmRoleFilterParameters filterParameters);
}
