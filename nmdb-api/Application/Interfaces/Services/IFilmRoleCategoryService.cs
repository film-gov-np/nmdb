using Application.Dtos.Film;
using Core;

namespace Application.Interfaces.Services;

public interface IFilmRoleCategoryService
{
    Task<ApiResponse<string>> Create(FilmRoleCategoryDto filmRoleCategory);
    Task<ApiResponse<string>> Update(int Id, FilmRoleCategoryDto filmRoleCategory);
    Task<ApiResponse<FilmRoleCategoryDto>> GetById(int roleId);
    Task<ApiResponse<string>> DeleteById(string roleId);
    Task<ApiResponse<List<FilmRoleCategoryDto>>> GetAll();
}
