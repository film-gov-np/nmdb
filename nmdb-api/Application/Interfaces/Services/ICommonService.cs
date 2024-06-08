using Application.Dtos.Film;
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
}
