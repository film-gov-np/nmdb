using Core.Constants;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;

namespace nmdb.Controllers
{
    [ApiController]
    [RequiredRoles(AuthorizationConstants.AdminRole)]
    [Route("api/users")]
    public class UsersController:AuthorizedController
    {

    }
}
