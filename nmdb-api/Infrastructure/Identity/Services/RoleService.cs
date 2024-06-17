using Application.Dtos.Role;
using Core.Constants;
using Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity.Services
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        public RoleService(RoleManager<ApplicationRole> roleManager)
        {
            _roleManager = roleManager;
        }
        public async Task<ApiResponse<List<RoleDto>>> GetAllRoles()
        {
            try
            {
                var roles = await _roleManager.Roles.Select(r => new RoleDto
                {
                    Id = r.Id,
                    Name = r.Name!
                }).Where(r => r.Name != AuthorizationConstants.SuperUserRole).ToListAsync();
                return ApiResponse<List<RoleDto>>.SuccessResponse(roles);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<RoleDto>>.ErrorResponse(ex.Message);
            }
        }
    }
}
