using Core.Constants;

namespace nmdb.Endpoints.Auth
{
    public class AuthHelper(IHttpContextAccessor _httpContextAccessor)
    {
        public void setTokenCookie(string accessToken, string refreshToken = "")
        {
            // append cookie with refresh token to the http response
            //var cookieOptions = new CookieOptions
            //{
            //    HttpOnly = true,
            //    Expires = DateTime.UtcNow.AddDays(7),
            //    SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
            //    Secure = true,

            //};
            //_httpContextAccessor.HttpContext.Response.Cookies.Append(TokenConstants.RefreshToken, refreshToken, cookieOptions);

            var cookieOptions = new CookieOptions()
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(2),
                SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None
            };
            _httpContextAccessor.HttpContext.Response.Cookies.Append(TokenConstants.AccessToken, accessToken, cookieOptions);

        }
    }
}
