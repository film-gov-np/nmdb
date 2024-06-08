using Azure.Core;
using Infrastructure.Identity.Security.TokenGenerator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;

namespace nmdb.Filters
{
    public class CustomTokenAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public CustomTokenAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            IJwtTokenGenerator jwtTokenGenerator)
            : base(options, logger, encoder, clock)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Cookies.TryGetValue("accessToken", out var token))
            {
                return AuthenticateResult.Fail("Token is missing from cookie.");
            }

            if (_jwtTokenGenerator.IsTokenExpired(token))
            {
                return AuthenticateResult.Fail("Token has expired.");
            }

            var claimsPrincipal = _jwtTokenGenerator.GetClaimsPrincipalFromToken(token);
            if (claimsPrincipal == null)
            {
                return AuthenticateResult.Fail("Invalid token.");
            }

            var ticket = new AuthenticationTicket(claimsPrincipal, Scheme.Name);
            return AuthenticateResult.Success(ticket);
        }
    }
}
