using Application.Dtos;
using Application.Dtos.Auth;
using Core;
using System.Security.Claims;

namespace Infrastructure.Identity.Services
{
    public interface IAuthService
    {
        Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, string ipAddress);
        //string ValidateToken(string token);
        Task<AuthenticateResponse> RefreshToken(string token, string ipAddress);
        Task RevokeToken(string token, string ipAddress);
        Task<ApiResponse<string>> Register(RegisterRequest model);
        Task<ApiResponse<string>> RegisterCrew(RegisterRequest model);
        Task VerifyEmail(string token);
        Task ForgotPassword(ForgotPasswordRequest model);
        Task ValidateResetToken(ValidateResetTokenRequest model);
        Task ResetPassword(ResetPasswordRequest model);
        Task<PaginationResponseOld<AccountResponse>> GetAll(int pageNumber, int pageSize, string keyword);
        Task<AccountResponse> GetByIdx(string idx);
        Task<AccountResponse> GetById(string id);
        Task<AccountResponse> Create(CreateRequest model);
        Task<AccountResponse> Update(string idx, Application.Models.UpdateUserDTO model);
        CurrentUser GetUserFromClaims(IEnumerable<Claim> claims);
        Task Delete(string idx);
        Task<AuthenticateResponse> GetCurrentSessionUser(string userID);
    }
}
