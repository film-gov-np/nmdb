using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Application.Interfaces;
using Application.Interfaces.Services;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Application.Services;

public class FilmRoleService : IFilmRoleService
{
    private readonly IUnitOfWork _unitOfWork;

    public FilmRoleService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public Task<bool> Create(FilmRoleDto filmRoleDto)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteById(string roleId)
    {
        throw new NotImplementedException();
    }

    public async Task<PaginationResponse<FilmRoleResponse>> GetAll(FilmRoleFilterParameters filterParameters)
    {
        Expression<Func<FilmRole, bool>> filter = null;
        Expression<Func<FilmRole, object>> orderByColumn = null;
        Func<IQueryable<FilmRole>, IOrderedQueryable<FilmRole>> orderBy = null;
        if (filterParameters.CategoryId != null || !string.IsNullOrEmpty(filterParameters.SearchKeyword))
        {
            filter = query =>
                (filterParameters.CategoryId == null || query.RoleCategoryId == filterParameters.CategoryId) &&
                (string.IsNullOrEmpty(filterParameters.SearchKeyword) || query.RoleName.Contains(filterParameters.SearchKeyword));
        }

        if (!string.IsNullOrEmpty(filterParameters.SortColumn))
        {
            switch (filterParameters.SortColumn.ToLower())
            {
                case "rolename":
                    orderByColumn = query => query.RoleName;
                    break;
                case "categoryname":
                    orderByColumn = query => query.RoleCategory.CategoryName;
                    break;
                // Add more cases for other columns
                default:
                    throw new ArgumentException($"Invalid sort column: {filterParameters.SortColumn}");                    
            }
        }

        var (query, totalItems) = await _unitOfWork.FilmRoleRepository.GetWithFilter(filterParameters, filter: filter, orderByColumn: orderByColumn);
        var filmRoleResponse = await query.Select(
        fr => new FilmRoleResponse(
                         fr.Id,
                         fr.RoleName,
                         fr.RoleCategory.CategoryName,
                         fr.DisplayOrder)).ToListAsync();

        var response = new PaginationResponse<FilmRoleResponse>
        {
            Items = filmRoleResponse,
            TotalItems = totalItems,
            PageNumber = filterParameters.PageNumber,
            PageSize = filterParameters.PageSize
        };

        return response;
    }

    public Task<FilmRoleResponse> GetById(int roleId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> Update(int Id, FilmRoleCategoryDto filmRoleDto)
    {
        throw new NotImplementedException();
    }
}
