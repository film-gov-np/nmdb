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
    Task<bool> Create(FilmRoleDto filmRoleDto);
    Task<bool> Update(int Id, FilmRoleCategoryDto filmRoleDto);
    Task<FilmRoleResponse> GetById(int roleId);
    Task<bool> DeleteById(string roleId);
    Task<PaginationResponse<FilmRoleResponse>> GetAll(FilmRoleFilterParameters filmRoleFilterParameters);
}
