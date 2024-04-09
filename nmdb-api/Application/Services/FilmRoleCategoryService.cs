using Application.Dtos.Film;
using Application.Interfaces.Services;
using Core;

namespace Application.Services;

public class FilmRoleCategoryService : IFilmRoleCategoryService
{
    public Task<ApiResponse<string>> Create(FilmRoleCategoryDto filmRoleCategory)
    {
        throw new NotImplementedException();
    }

    public Task<ApiResponse<string>> DeleteById(string roleId)
    {
        throw new NotImplementedException();
    }

    public Task<ApiResponse<List<FilmRoleCategoryDto>>> GetAll()
    {
        throw new NotImplementedException();
    }

    public Task<ApiResponse<FilmRoleCategoryDto>> GetById(string roleId)
    {
        throw new NotImplementedException();
    }

    public Task<ApiResponse<string>> Update(int Id, FilmRoleCategoryDto filmRoleCategory)
    {
        throw new NotImplementedException();
    }
}
