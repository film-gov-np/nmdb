using Application.Dtos.Film;
using Application.Interfaces;
using Application.Interfaces.Services;
using AutoMapper;
using Core;
using MediatR;
using System.Net;

namespace Application.Services;

public class FilmRoleCategoryService : IFilmRoleCategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public FilmRoleCategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
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

    public async Task<ApiResponse<FilmRoleCategoryDto>> GetById(int roleId)
    {
        var roleCategory = await _unitOfWork.FilmRoleCategoryRepository.GetByIdAsync(roleId);
        if(roleCategory == null)
        {
            return new ApiResponse<FilmRoleCategoryDto>
            {
                IsSuccess = false,
                Message = $"The role category with id {roleId} does not exist.",
                StatusCode = HttpStatusCode.NotFound
            };
        }
        var filmRoleCategoryDto = _mapper.Map<FilmRoleCategoryDto>(roleCategory);
        return new ApiResponse<FilmRoleCategoryDto>
        {
            IsSuccess = true,
            StatusCode = HttpStatusCode.OK,
            Data = filmRoleCategoryDto
        };
    }

    public Task<ApiResponse<string>> Update(int Id, FilmRoleCategoryDto filmRoleCategory)
    {
        throw new NotImplementedException();
    }
}
