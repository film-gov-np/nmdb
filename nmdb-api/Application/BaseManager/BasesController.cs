using Application.Response;
using Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Web;

namespace Application
{
    public class BaseAPIController : ControllerBase
    {
        private readonly ApiResponse aPIResponse;
        protected readonly ILogger<BaseAPIController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public BaseAPIController(ApiResponse aPIResponse, ILogger<BaseAPIController> _logger, IHttpContextAccessor httpContextAccessor)
        {
            this.aPIResponse = aPIResponse;
            this._logger = _logger;
            this._httpContextAccessor = httpContextAccessor;
        }

        // [NonAction]
        // public OkObjectResult OnSuccess(object data, int status_code = 200)
        // {
        //     return Ok(this.aPIResponse.APISuccessResponse(data, status_code));
        // }
        // [NonAction]
        // public BadRequestObjectResult OnBadRequest(string message, string error_type, int status_code = 400)
        // {
        //     return BadRequest(this.aPIResponse.ApiErrorResponse(message, error_type, status_code));
        // }
        // [NonAction]
        // public NotFoundObjectResult OnNotFound(string message, string error_type, int status_code = 404)
        // {
        //     return NotFound(this.aPIResponse.ApiErrorResponse(message, error_type, status_code));
        // }

        public string CurrentUserID
        {
            get
            {
                string userID = string.Empty;
                Core.Data user = (Core.Data?)_httpContextAccessor.HttpContext.Items["user"];
                userID = user?.Idx;
                return userID;
            }
        }

        public string CurrentUserName
        {
            get
            {
                string userID = string.Empty;
                Core.Data user = (Core.Data?)_httpContextAccessor.HttpContext.Items["user"];
                userID = user?.Email;
                return userID;
            }
        }
        public string GetHostUrl
        {
            get
            {
                return $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            }
        }

    }
}
