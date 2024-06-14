using Application.Dtos.User;
using Core;

namespace Infrastructure.Identity.Services;

public interface IUserService
{
    Task<ApiResponse<string>> CreateUserAsync(UserRequestDto userRequest);
    Task<ApiResponse<string>> UpdateUserAsync(UserRequestDto userRequest);
    Task<ApiResponse<string>> DeleteUserAsync(string userId);
    Task<ApiResponse<string>> UpdateUserRoleAsync(string userId, string roleId);
}
