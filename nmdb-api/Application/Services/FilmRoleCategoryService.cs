using Application.Dtos.Film;
using Application.Helpers;
using Application.Interfaces;
using Application.Interfaces.Services;
using AutoMapper;
using Core;
using Core.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Application.Services;

public class FilmRoleCategoryService : IFilmRoleCategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IService _service;
    public FilmRoleCategoryService(IUnitOfWork unitOfWork, IMapper mapper, IService service)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _service = service;
    }
    public async Task<ApiResponse<string>> Create(FilmRoleCategoryDto roleCatgeoryRequest)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();
            FilmRole filmRole = new()
            {
                RoleName = roleCatgeoryRequest.CategoryName,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "test"
            };
            await _unitOfWork.FilmRoleRepository.AddAsync(filmRole);
            await _unitOfWork.CommitAsync();
            return ApiResponse<string>.SuccessResponse("Role category created successfully.");
        }
        catch (Exception ex)
        {
            // Log errors
            Console.WriteLine(ex.ToString());
            _unitOfWork.Rollback();
            return ApiResponse<string>.ErrorResponse(
                "Something went wrong while creating role category.",
                HttpStatusCode.InternalServerError);
        }
    }

    public Task<ApiResponse<string>> DeleteById(string roleId)
    {
        throw new NotImplementedException();
    }

    public async Task<List<FilmRoleCategoryDto>> GetAllAsync()
    {
        var filmRoleCategoryList = await _service.List<FilmRoleCategory, FilmRoleCategoryDto>();
        var filmRoleCategoryListDto = _mapper.Map<List<FilmRoleCategoryDto>>(filmRoleCategoryList);
        return filmRoleCategoryListDto;
    }

    public async Task<ApiResponse<FilmRoleCategoryDto>> GetById(int roleId)
    {
        var roleCategory = await _unitOfWork.FilmRoleCategoryRepository.GetByIdAsync(roleId);
        if (roleCategory == null)
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
