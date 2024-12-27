using Application.Dtos.User;
using Azure;
using Core;
using FastEndpoints;
using Infrastructure.Identity.Services;
using Microsoft.AspNetCore.Http;
using nmdb.Filters;
using System.Net;
using System.Web.Mvc;

namespace nmdb.Endpoints.Auth
{
    public class Register
        : Endpoint<ChangePasswordRequestDto, ApiResponse<string>>
    {
        private readonly IAuthService _authService;
        private readonly IHttpContextAccessor _contextAccessor;
        public Register(IAuthService authService, IHttpContextAccessor contextAccessor)
        {
            _authService = authService;
            _contextAccessor = contextAccessor;
        }
        public override void Configure()
        {            
            Post("api/auth/change-password");
        }

        public override async Task HandleAsync(ChangePasswordRequestDto request,
            CancellationToken cancellationToken)
        {
            try
            {
                var current_user = _contextAccessor.HttpContext.User.Identity;

                if (!current_user.IsAuthenticated)
                {
                    Response = ApiResponse<string>.ErrorResponse("Unauthorized Access.", HttpStatusCode.Unauthorized);
                    return;
                }
                request.Email = current_user.Name;
                var changePasswordResponse = await _authService.ChangePassword(request);
                Response = changePasswordResponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
