using Application.Dtos.User;
using Core;
using Core.Constants;
using Infrastructure.Identity;
using Infrastructure.Identity.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;
using System.Net;

namespace nmdb.Controllers
{
    [ApiController]
    [RequiredRoles(AuthorizationConstants.AdminRole)]
    [Route("api/users")]
    public class UsersController : AuthorizedController
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserRequestDto userRequest)
        {
            if (userRequest == null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid user request."));
            }

            var response = await _userService.CreateUserAsync(userRequest);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserRequestDto userRequest)
        {
            if (userRequest == null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid user request."));
            }
            userRequest.Id = id;
            var response = await _userService.UpdateUserAsync(userRequest);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            else
                return BadRequest(result);

        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] string roleId)
        {
            var result = await _userService.UpdateUserRoleAsync(id, roleId);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            else
                return BadRequest(result);

        }
    }
}
