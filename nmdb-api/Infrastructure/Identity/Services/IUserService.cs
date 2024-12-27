using Application.Dtos.FilterParameters;
using Application.Dtos.User;
using Application.Helpers.Response;
using Core;

namespace Infrastructure.Identity.Services;

public interface IUserService
{
    Task<ApiResponse<string>> CreateUserAsync(UserRequestDto userRequest);
    Task<ApiResponse<string>> UpdateUserAsync(UserUpdateRequestDto userRequest);
    Task<ApiResponse<string>> DeleteUserAsync(string userId);
    Task<ApiResponse<UserResponseDto>> GetUserById(string userId);
    Task<ApiResponse<string>> UpdateUserRoleAsync(string userId, string roleId);
    Task<ApiResponse<PaginationResponse<UserResponseDto>>> GetUsers(UserFilterParameters filterParameters);
}
