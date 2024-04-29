using FastEndpoints;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;

namespace nmdb.Endpoints.Auth
{
    public class RefreshTokenRequest
    {
        public const string Route = "api/auth/refresh";        
        public string RefreshToken { get; set; }
        public RefreshTokenRequest(string refreshToken)
        {
            RefreshToken = refreshToken;
        }
    }
}
