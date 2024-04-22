using Application.Dtos;
using Core.Constants;
using Microsoft.AspNetCore.Mvc;
using nmdb.Filters;
using System.Security.Claims;

namespace nmdb.Common;

[TypeFilter(typeof(AuthorizedUserFilter))]
public class AuthorizedController : ControllerBase
{
    public string GetUserRoles
    {
        get
        {
            return User.FindFirst(ClaimTypes.Role)?.Value;
        }
    }
    public bool IsAdmin
    {
        get
        {
            string[] usersRoles = this.GetUserRoles.Split(',').ToArray<string>();
            return usersRoles.Contains(AuthorizationConstants.SuperUser) || usersRoles.Contains(AuthorizationConstants.Admin);
        }
    }

    public string GetUserName
    {
        get
        {
            string userName = User.FindFirst(ClaimTypes.Name)?.Value;
            return userName;
        }
    }
    public string HostUrl
    {
        get
        {
            return $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
        }
    }
    public CurrentUser CurrentUser => (CurrentUser)HttpContext.Items["CurrentUser"];

}
