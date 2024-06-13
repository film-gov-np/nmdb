using Application.Dtos;
using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services;

public interface ICommonService
{
    Task<ApiResponse<List<FilmRoleBasicDto>>> GetAllRoles();
    Task<ApiResponse<GlobalSearchResponseDto>> GetGlobalSearchResults(BaseFilterParameters filterParams);
}
