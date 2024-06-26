﻿using Application.Dtos.FilterParameters;
using Application.Dtos.Media;
using Application.Dtos.Movie;
using Application.Dtos.Role;
using Application.Dtos.User;
using Application.Helpers;
using Application.Helpers.Response;
using Application.Interfaces.Services;
using AutoMapper;
using Core;
using Core.Constants;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq.Expressions;

namespace Infrastructure.Identity.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IFileService _fileService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMapper _mapper;
    private const string userSubDirectory = "users";
    private readonly string _uploadFolderPath;
    private readonly AppDbContext _context;

    public UserService(UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IHttpContextAccessor httpContextAccessor,
        IFileService fileService,
        IMapper mapper,
        IConfiguration configuration,
        AppDbContext context)

    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
        _fileService = fileService;
        _httpContextAccessor = httpContextAccessor;
        _uploadFolderPath = string.Concat(configuration["UploadFolderPath"], "/users/");
        _context = context;
    }

    public async Task<ApiResponse<string>> CreateUserAsync(UserRequestDto userRequest)
    {
        try
        {
            // Map the UserRequestDto to ApplicationUser
            var user = _mapper.Map<ApplicationUser>(userRequest);
            user.CreatedBy = userRequest.Authorship;
            user.UserName = userRequest.Email;

            // Set the default role if not provided
            if (string.IsNullOrEmpty(userRequest.Role))
            {
                userRequest.Role = AuthorizationConstants.UserRole;
            }

            // Check if the role exists
            var roleToBeAssigned = await _roleManager.FindByNameAsync(userRequest.Role);
            if (roleToBeAssigned == null)
            {
                return ApiResponse<string>.ErrorResponse($"Role '{userRequest.Role}' does not exist in the database.");
            }

            // Create the user
            var userCreateResult = await _userManager.CreateAsync(user, userRequest.Password);
            if (!userCreateResult.Succeeded)
            {
                var errorMessage = string.Join(", ", userCreateResult.Errors.Select(e => e.Description));
                return ApiResponse<string>.ErrorResponse(errorMessage);
            }

            // Assign the role to the user
            var assignRoleResult = await _userManager.AddToRoleAsync(user, userRequest.Role);
            if (!assignRoleResult.Succeeded)
            {
                var errorMessage = string.Join(", ", assignRoleResult.Errors.Select(e => e.Description));
                return ApiResponse<string>.ErrorResponse(errorMessage);
            }

            // Upload the profile photo if it exists
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
                    await _userManager.UpdateAsync(user);
                }
            }

            return ApiResponse<string>.SuccessResponseWithoutData($"User '{userRequest.Email}' created successfully.");
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
            existingUser.UpdatedBy = userRequest.Authorship;

            // Role update logic
            // Allow to update role in separate api call
            if (!string.IsNullOrEmpty(userRequest.Role))
            {
                var roleToBeAssigned = await _roleManager.FindByNameAsync(userRequest.Role);

                if (roleToBeAssigned == null)
                {
                    return ApiResponse<string>.ErrorResponse($"Role '{userRequest.Role}' does not exist in the database.");
                }

                var userRoles = await _userManager.GetRolesAsync(existingUser);
                var removeRolesResult = await _userManager.RemoveFromRolesAsync(existingUser, userRoles.ToArray());
                if (!removeRolesResult.Succeeded)
                {
                    var errorMessage = string.Join(", ", removeRolesResult.Errors.Select(e => e.Description));
                    return ApiResponse<string>.ErrorResponse(errorMessage);
                }

                var addRoleResult = await _userManager.AddToRoleAsync(existingUser, userRequest.Role);
                if (!addRoleResult.Succeeded)
                {
                    var errorMessage = string.Join(", ", addRoleResult.Errors.Select(e => e.Description));
                    return ApiResponse<string>.ErrorResponse(errorMessage);
                }
            }

            // Update the user details
            var updateResult = await _userManager.UpdateAsync(existingUser);

            if (!updateResult.Succeeded)
            {
                var errorMessage = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                return ApiResponse<string>.ErrorResponse(errorMessage);
            }

            // Upload the profile photo if it exists
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
                    // Remove old profile photo
                    if (!string.IsNullOrEmpty(existingUser.ProfilePhoto))
                    {
                        _fileService.RemoveFile(existingUser.ProfilePhoto, userSubDirectory);
                    }

                    existingUser.ProfilePhoto = uploadResult.Data.FileName;

                    // Update the user profile photo information
                    var photoUpdateResult = await _userManager.UpdateAsync(existingUser);
                    if (!photoUpdateResult.Succeeded)
                    {
                        var errorMessage = string.Join(", ", photoUpdateResult.Errors.Select(e => e.Description));
                        return ApiResponse<string>.ErrorResponse(new List<string>{
                            "User is updated successfully with errors while updating profile photo.",
                            errorMessage });

                    }
                }
                else
                {
                    return ApiResponse<string>.ErrorResponse(
                        new List<string> { "Something went wrong while uploading profile photo.",
                    uploadResult.Message});
                }
            }

            return ApiResponse<string>.SuccessResponseWithoutData("User updated successfully.");
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
                userResponse.ProfilePhotoUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPath, user.ProfilePhoto);
            }

            var roles = await _userManager.GetRolesAsync(user);
            userResponse.Role = string.Join(", ", roles);

            return ApiResponse<UserResponseDto>.SuccessResponse(userResponse);
        }
        catch (Exception ex)
        {
            return ApiResponse<UserResponseDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponse<PaginationResponse<UserResponseDto>>> GetUsers(UserFilterParameters filterParameters)
    {
        try
        {            
            var superuserIds = await (from userRole in _context.UserRoles
                                      join role in _context.Roles on userRole.RoleId equals role.Id
                                      where role.Name == AuthorizationConstants.SuperUserRole
                                      select userRole.UserId).ToListAsync();

            var query = _userManager.Users.Where(u => !superuserIds.Contains(u.Id)).AsQueryable().AsNoTracking();

            if (!string.IsNullOrEmpty(filterParameters.SearchKeyword))
            {
                query = query.Where(u => u.Email.Contains(filterParameters.SearchKeyword) ||
                                         u.Name.Contains(filterParameters.SearchKeyword));
            }

            if (!string.IsNullOrEmpty(filterParameters.SortColumn))
            {
                query = ApplySorting(query, filterParameters.SortColumn, filterParameters.Descending);
            }

            var totalCount = await query.CountAsync();
            var hostUrl = ImageUrlHelper.GetHostUrl(_httpContextAccessor);

            var paginatedUsers = await query
                .Skip((filterParameters.PageNumber - 1) * filterParameters.PageSize)
                .Take(filterParameters.PageSize)
                .ToListAsync();

            var userIds = paginatedUsers.Select(u => u.Id).ToList();

            var userRoles = await (from userRole in _context.UserRoles
                                   join role in _context.Roles on userRole.RoleId equals role.Id
                                   where userIds.Contains(userRole.UserId)
                                   select new
                                   {
                                       UserId = userRole.UserId,
                                       RoleName = role.Name
                                   }).ToListAsync();

            var userResponseDtos = paginatedUsers.Select(user =>
            {
                var roles = userRoles.Where(ur => ur.UserId == user.Id).Select(ur => ur.RoleName).ToList();
                var userDto = _mapper.Map<UserResponseDto>(user);
                userDto.Role = string.Join(",", roles);
                userDto.ProfilePhotoUrl = ImageUrlHelper.GetFullImageUrl(hostUrl, _uploadFolderPath, user.ProfilePhoto);
                return userDto;
            }).ToList();

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

    private IQueryable<ApplicationUser> ApplySorting(IQueryable<ApplicationUser> query, string sortColumn, bool descending)
    {
        Expression<Func<ApplicationUser, object>> orderByColumn = sortColumn.ToLower() switch
        {
            "name" => u => u.Name,
            "email" => u => u.Email,
            "phonenumber" => u => u.PhoneNumber,
            _ => throw new ArgumentException($"Invalid sort column: {sortColumn}")
        };

        return descending ? query.OrderByDescending(orderByColumn) : query.OrderBy(orderByColumn);
    }


    private bool IsSuperuser(ApplicationUser user)
    {
        // Check if the user has the 'Superuser' role
        return _userManager.IsInRoleAsync(user, AuthorizationConstants.SuperUserRole).Result;
    }
}
