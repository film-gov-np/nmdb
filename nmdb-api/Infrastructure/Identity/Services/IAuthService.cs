﻿using Application.Dtos.Auth;
using Core;

namespace Infrastructure.Identity.Services
{
    public interface IAuthService
    {
        Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, string ipAddress);
        string ValidateToken(string token);
        Task<AuthenticateResponse> RefreshToken(string token, string ipAddress);
        Task RevokeToken(string token, string ipAddress);
        Task<ApiResponse<string>> Register(RegisterRequest model);
        Task VerifyEmail(string token);
        Task ForgotPassword(ForgotPasswordRequest model);
        Task ValidateResetToken(ValidateResetTokenRequest model);
        Task ResetPassword(ResetPasswordRequest model);
        Task<PaginatedResult<AccountResponse>> GetAll(int pageNumber, int pageSize, string keyword);
        Task<AccountResponse> GetByIdx(string idx);
        Task<AccountResponse> GetById(string id);
        Task<AccountResponse> Create(CreateRequest model);
        Task<AccountResponse> Update(string idx, Application.Models.UpdateUserDTO model);
        Task Delete(string idx);
    }
}