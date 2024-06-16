using Application.Dtos.FilterParameters;
using Application.Dtos.Media;
using Application.Dtos.Movie;
using Application.Dtos.User;
using Application.Helpers;
using Application.Helpers.Response;
using Application.Interfaces.Services;
using AutoMapper;
using Core;
using Core.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IFileService _fileService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMapper _mapper;
    private const string userSubDirectory = "/upload/img/users/";

    public UserService(UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IHttpContextAccessor httpContextAccessor,
        IFileService fileService,
        IMapper mapper)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
        _fileService=fileService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ApiResponse<string>> CreateUserAsync(UserRequestDto userRequest)
    {
        try
        {
            var user = _mapper.Map<ApplicationUser>(userRequest);
            user.CreatedBy = userRequest.Authorship;
            user.UserName = userRequest.Email;


            if (userRequest.ProfilePhotoFile != null)
            {
                FileDTO fileDto = new FileDTO
                {
                    Files = userRequest.ProfilePhotoFile,
                    Thumbnail = false,
                    ReadableName = false,
                    SubFolder = userSubDirectory
                };
                var uploadResult = await _fileService.UploadFile(fileDto);
                if (uploadResult.IsSuccess && uploadResult.Data != null)
                {
                    user.ProfilePhoto = uploadResult.Data.FileName;
                }
            }

            if (string.IsNullOrEmpty(userRequest.Role))
                userRequest.Role = AuthorizationConstants.UserRole;

            var roleToBeAssigned = await _roleManager.FindByNameAsync(userRequest.Role);

            if (roleToBeAssigned == null)
            {
                return ApiResponse<string>.ErrorResponse($"Role '{roleToBeAssigned?.Name}'  does not exist in the database.");
            }

            var userCreateResult = await _userManager.CreateAsync(user, userRequest.Password);

            var errorMessage = "";
            if (userCreateResult.Succeeded)
            {
                var assignRoleResult = await _userManager.AddToRoleAsync(user, userRequest.Role);
                if (assignRoleResult.Succeeded)
                {
                    return ApiResponse<string>.SuccessResponse("User created successfully.");
                }
                errorMessage = string.Join(", ", assignRoleResult.Errors.First().Description);
            }
            else
                errorMessage = string.Join(", ", userCreateResult.Errors.First().Description);

            return ApiResponse<string>.ErrorResponse(errorMessage);
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponse<string>> UpdateUserAsync(UserUpdateRequestDto userRequest)
    {
        try
        {
            var existingUser = await _userManager.FindByIdAsync(userRequest.Id);

            if (existingUser == null)
            {
                return ApiResponse<string>.ErrorResponse($"User with ID '{userRequest.Id}' not found.");
            }

            _mapper.Map(userRequest, existingUser);

            if (userRequest.ProfilePhotoFile != null)
            {
                FileDTO fileDto = new FileDTO
                {
                    Files = userRequest.ProfilePhotoFile,
                    Thumbnail = false,
                    ReadableName = true,
                    SubFolder = userSubDirectory
                };
                var uploadResult = await _fileService.UploadFile(fileDto);
                if (uploadResult.IsSuccess && uploadResult.Data != null)
                {
                    if (!string.IsNullOrEmpty(userRequest.ProfilePhoto))
                        _fileService.RemoveFile(userRequest.ProfilePhoto, fileDto.SubFolder);

                    existingUser.ProfilePhoto = uploadResult.Data.FileName;
                }
            }
            if (!string.IsNullOrEmpty(userRequest.Role))
            {
                var roleToBeAssigned = await _roleManager.FindByNameAsync(userRequest.Role);

                if (roleToBeAssigned == null)
                {
                    return ApiResponse<string>.ErrorResponse($"Role '{userRequest.Role}' does not exist in the database.");
                }

                var userRoles = await _userManager.GetRolesAsync(existingUser);
                await _userManager.RemoveFromRolesAsync(existingUser, userRoles.ToArray());
                await _userManager.AddToRoleAsync(existingUser, userRequest.Role);
            }

            var result = await _userManager.UpdateAsync(existingUser);

            if (result.Succeeded)
            {
                return ApiResponse<string>.SuccessResponse("User updated successfully.");
            }

            return ApiResponse<string>.ErrorResponse("Something went wrong while updating user.");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponse<string>> DeleteUserAsync(string userId)
    {
        try
        {
            var existingUser = await _userManager.FindByIdAsync(userId);

            if (existingUser == null)
            {
                return ApiResponse<string>.ErrorResponse($"User with ID '{userId}' not found.");
            }

            var result = await _userManager.DeleteAsync(existingUser);

            if (result.Succeeded)
            {
                return ApiResponse<string>.SuccessResponse("User deleted successfully.");
            }

            return ApiResponse<string>.ErrorResponse("Something went wrong while deleting user.");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponse<string>> UpdateUserRoleAsync(string userId, string newRole)
    {
        try
        {
            var existingUser = await _userManager.FindByIdAsync(userId);

            if (existingUser == null)
            {
                return ApiResponse<string>.ErrorResponse($"User with ID '{userId}' not found.");
            }

            var existingRoles = await _userManager.GetRolesAsync(existingUser);
            var result = await _userManager.RemoveFromRolesAsync(existingUser, existingRoles.ToArray());

            if (!result.Succeeded)
            {
                return ApiResponse<string>.ErrorResponse("Failed to remove existing roles from user.");
            }

            if (!string.IsNullOrEmpty(newRole))
            {
                var roleToBeAssigned = await _roleManager.FindByNameAsync(newRole);

                if (roleToBeAssigned == null)
                {
                    return ApiResponse<string>.ErrorResponse($"Role '{newRole}' does not exist in the database.");
                }

                result = await _userManager.AddToRoleAsync(existingUser, newRole);

                if (!result.Succeeded)
                {
                    return ApiResponse<string>.ErrorResponse($"Failed to assign role '{newRole}' to user.");
                }
            }

            return ApiResponse<string>.SuccessResponse("User role updated successfully.");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponse<UserResponseDto>> GetUserById(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return ApiResponse<UserResponseDto>.ErrorResponse($"User with id '{userId}' not found.");
            var userResponse = _mapper.Map<UserResponseDto>(user);
            if (!string.IsNullOrEmpty(user.ProfilePhoto))
            {
                var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);
                userResponse.ProfilePhotoUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, userSubDirectory, user.ProfilePhoto);
            }
            return ApiResponse<UserResponseDto>.SuccessResponse(userResponse);
        }
        catch (Exception ex)
        {
            return ApiResponse<UserResponseDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponse<PaginationResponse<UserResponseDto>>> GetUsers(BaseFilterParameters filterParameters)
    {
        try
        {
            var query = _userManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(filterParameters.SearchKeyword))
            {
                query = query.Where(u => u.Email.Contains(filterParameters.SearchKeyword) ||
                u.FirstName.Contains(filterParameters.SearchKeyword) ||
                u.LastName.Contains(filterParameters.SearchKeyword));
            }

            var totalCount = await query.CountAsync();
            var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);

            // fetch only certain columns with pagination
            var users = await query
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    ProfilePhotoUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, userSubDirectory, u.ProfilePhoto)
                })
                .Skip((filterParameters.PageNumber - 1) * filterParameters.PageSize)
                .Take(filterParameters.PageSize)
                .ToListAsync();
                        
            var userResponseDtos = users.Select(user => _mapper.Map<UserResponseDto>(user)).ToList();

            var pagedResult = new PaginationResponse<UserResponseDto>
            {
                Items = userResponseDtos,
                TotalItems = totalCount,
                PageNumber = filterParameters.PageNumber,
                PageSize = filterParameters.PageSize
            };

            return ApiResponse<PaginationResponse<UserResponseDto>>.SuccessResponse(pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponse<PaginationResponse<UserResponseDto>>.ErrorResponse(ex.Message);
        }
    }
}
