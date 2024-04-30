using Core.Constants;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;

namespace nmdb.Controllers
{
    [ApiController]
    [CustomAuthorize(AuthorizationConstants.AdminRole, AuthorizationConstants.UserRole)]
    [Route("api/theatres/")]
    public class TheatreController : AuthorizedController
    {
    }
}
