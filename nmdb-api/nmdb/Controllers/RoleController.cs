using Core.Constants;
using Infrastructure.Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;

namespace nmdb.Controllers;

[ApiController]
[Authorize]
[RequiredRoles(AuthorizationConstants.AdminRole)]
[Route("api/roles")]
public class RoleController : AuthorizedController
{
    private readonly IRoleService _roleService;
    public RoleController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllRoles()
    {
        try
        {
            var rolesResult = await _roleService.GetAllRoles();
            if (rolesResult.IsSuccess)
                return Ok(rolesResult);

            return BadRequest(rolesResult);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
