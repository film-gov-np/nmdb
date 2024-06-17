using Application.Dtos.Role;
using Core;

namespace Infrastructure.Identity.Services;

public interface IRoleService
{
    Task<ApiResponse<List<RoleDto>>> GetAllRoles();

}
