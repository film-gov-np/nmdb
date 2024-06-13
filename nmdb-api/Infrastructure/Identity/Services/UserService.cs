using Application.Dtos.User;
using Application.Models;
using AutoMapper;
using Core;
using Core.Constants;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IMapper _mapper;

    public UserService(UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IMapper mapper)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
    }

    public async Task<ApiResponse<string>> CreateUserAsync(UserRequestDto userRequest)
    {
        try
        {
            var user = _mapper.Map<ApplicationUser>(userRequest);
            user.CreatedBy = userRequest.Authorship;

            if (string.IsNullOrEmpty(userRequest.Role))
                userRequest.Role = AuthorizationConstants.UserRole;

            var roleToBeAssigned = await _roleManager.FindByNameAsync(userRequest.Role);

            if (roleToBeAssigned == null)
            {
                return ApiResponse<string>.ErrorResponse($"Role '{roleToBeAssigned.Name}'  does not exist in the database.");
            }
            var userCreated = await _userManager.CreateAsync(user, userRequest.Password);
            await _userManager.AddToRoleAsync(user, userRequest.Role);

            if (userCreated.Succeeded)
            {
                return ApiResponse<string>.SuccessResponse("User created successfully.");
            }
            return ApiResponse<string>.ErrorResponse("Something went wrong while creating user.");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponse<string>> UpdateUserAsync(UserRequestDto userRequest)
    {
        try
        {
            var existingUser = await _userManager.FindByIdAsync(userRequest.Id);

            if (existingUser == null)
            {
                return ApiResponse<string>.ErrorResponse($"User with ID '{userRequest.Id}' not found.");
            }

            _mapper.Map(userRequest, existingUser);

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

    public Task<ApiResponse<string>> AssignRoleAsync(string userId, string roleId)
    {
        throw new NotImplementedException();
    }
}
