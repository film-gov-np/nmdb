
using Application.Dtos;
using Application.Dtos.Auth;
using Core;
using Core.Constants;
using Core.Entities;
using Infrastructure.Identity.Security.TokenGenerator;
using Infrastructure.Identity.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Net.Http.Headers;
using nmdb.Filters;
using System.Net;
using System.Security.Claims;

namespace nmdb.Controllers;

[ApiController]
[Route("api/session")]
public class SessionController : ControllerBase
{
    private readonly IAuthService _usrAuth;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public SessionController(IAuthService usrAuth, IJwtTokenGenerator jwtTokenGenerator)
    {
        _usrAuth = usrAuth;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    [HttpGet]
    public async Task<IActionResult> CheckSession()
    {
        var accessToken = Request.Cookies[TokenConstants.AccessToken];
        var refreshToken = Request.Cookies[TokenConstants.RefreshToken];

        if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest(ApiResponse<string>.ErrorResponse("Inactive session.", HttpStatusCode.BadRequest));
        }


        if (!string.IsNullOrEmpty(accessToken))
        {
            if (!_jwtTokenGenerator.IsTokenExpired(accessToken))
            {
                ClaimsPrincipal claimPrincipal = _jwtTokenGenerator.GetClaimsPrincipalFromToken(accessToken);
                if (claimPrincipal == null)
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Inactive session.", HttpStatusCode.BadRequest));
                }
                ClaimsIdentity claimsIdentity = claimPrincipal.Claims.FirstOrDefault().Subject;
                CurrentUser user = _usrAuth.GetUserFromClaims(claimsIdentity.Claims);
                var resp = await _usrAuth.GetCurrentSessionUser(user.ID);
                return Ok(ApiResponse<AuthenticateResponse>.SuccessResponse(resp, "Active Session."));
            }
            else // check for refresh token validity and refresh token if valid else remove the cookie
            {
                bool sessionExpired = true;
                AuthenticateResponse refreshResp = new();
                if (!string.IsNullOrWhiteSpace(refreshToken))
                {
                    refreshResp = await _usrAuth.RefreshToken(refreshToken, string.Empty);
                    sessionExpired = !(refreshResp?.Authenticated ?? true);
                }
                if (sessionExpired)
                {
                    Response.Cookies.Delete(TokenConstants.AccessToken);
                    Response.Cookies.Delete(TokenConstants.RefreshToken);
                    return BadRequest(ApiResponse<string>.ErrorResponse("Inactive session.", HttpStatusCode.BadRequest));
                }
                else
                {
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = true,
                        Expires = DateTime.UtcNow.AddDays(7),
                        SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                        Secure = true,

                    };
                    Response.Cookies.Append(TokenConstants.AccessToken, refreshResp.JwtToken, cookieOptions);

                    Response.Cookies.Append(TokenConstants.RefreshToken, refreshResp.RefreshToken, cookieOptions);
                    return Ok(ApiResponse<AuthenticateResponse>.SuccessResponse(refreshResp, "Active Session."));

                }
            }
        }
        return BadRequest(ApiResponse<string>.ErrorResponse("Inactive session.", HttpStatusCode.BadRequest));

    }

    [HttpPost]
    public async Task<IActionResult> Logout()
    {
        Response.Cookies.Delete(TokenConstants.AccessToken);
        Response.Cookies.Delete(TokenConstants.RefreshToken);
        return Ok(new { Message = "Logged out", IsActive = true });
    }
}
