using Application.Abstractions;
using Application.Dtos;
using Application.Dtos.Auth;
using Application.Interfaces.Services;
using AutoMapper;
using Azure.Core;
using BCrypt.Net;
using Core;
using Core.Constants;
using Infrastructure.Data;
using Infrastructure.Identity.Security.TokenGenerator;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace Infrastructure.Identity.Services
{
    public class AuthService : IAuthService
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly AppDbContext _context;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IMapper _mapper;
        private readonly JwtSettings _appSettings;
        private readonly IEmailService _emailService;
        private readonly ICrewService _crewService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(
            AppDbContext context,
            IJwtTokenGenerator jwtUtils,
            IMapper mapper,
            IOptions<JwtSettings> appSettings,
            IEmailService emailService,
            ICrewService crewService,
            IHttpContextAccessor httpContextAccessor,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            _context = context;
            _jwtTokenGenerator = jwtUtils;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _emailService = emailService;
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _crewService = crewService;
            _httpContextAccessor = httpContextAccessor;
        }



        public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest request, string ipAddress)
        {
            var requestedUser = await _userManager.Users.Include(u => u.RefreshTokens)
                                   .SingleOrDefaultAsync(u => u.Email == request.Email);
            if (requestedUser == null)
            {
                throw new UnauthorizedAccessException("Invalid login attempt.");
            }
            var result = await _signInManager.CheckPasswordSignInAsync(requestedUser, request.Password, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(requestedUser);
                var jwtToken = _jwtTokenGenerator.GenerateJwtToken(requestedUser, roles);
                var refreshToken = await _jwtTokenGenerator.GenerateRefreshToken(ipAddress);
                requestedUser.RefreshTokens.Add(refreshToken);

                // remove old refresh tokens from accountSSSSS
                await removeOldRefreshTokens(requestedUser);

                // save changes to db
                _context.Update(requestedUser);
                await _context.SaveChangesAsync();

                var response = _mapper.Map<AuthenticateResponse>(requestedUser);
                response.JwtToken = jwtToken;
                response.RefreshToken = refreshToken.Token;
                return response;
            }
            throw new UnauthorizedAccessException("Invalid login attempt.");
        }
        //public string ValidateToken(string token)
        //{
        //    return _jwtTokenGenerator.ValidateJwtToken(token);
        //    //var tokenHandler = new JwtSecurityTokenHandler();
        //    //var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

        //    //tokenHandler.ValidateToken(token, new TokenValidationParameters
        //    //{
        //    //    ValidateIssuerSigningKey = true,
        //    //    IssuerSigningKey = new SymmetricSecurityKey(key),
        //    //    ValidateIssuer = false,
        //    //    ValidateAudience = false
        //    //}, out SecurityToken validatedToken);
        //}



        public async Task<AuthenticateResponse> RefreshToken(string token, string ipAddress)
        {
            var applicationUser = await getAccountByRefreshToken(token);
            var refreshToken = applicationUser.RefreshTokens.Single(x => x.Token == token);

            //if (refreshToken.IsRevoked)
            //{
            //    // revoke all descendant tokens in case this token has been compromised
            //    await revokeDescendantRefreshTokens(refreshToken, applicationUser, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");
            //    _context.Update(applicationUser);
            //    await _context.SaveChangesAsync();
            //}

            //if (!refreshToken.IsActive)
            //    throw new AppException("Invalid token");

            // replace old refresh token with a new one (rotate token)
            var newRefreshToken = await rotateRefreshToken(refreshToken, ipAddress);
            applicationUser.RefreshTokens.Add(newRefreshToken);

            // remove old refresh tokens from account
            await removeOldRefreshTokens(applicationUser);

            // save changes to db
            _context.Update(applicationUser);
            await _context.SaveChangesAsync();

            // generate new jwt
            var roles = await _userManager.GetRolesAsync(applicationUser);
            var jwtToken = _jwtTokenGenerator.GenerateJwtToken(applicationUser, roles);

            // return data in authenticate response object
            var response = _mapper.Map<AuthenticateResponse>(applicationUser);
            response.JwtToken = jwtToken;
            response.RefreshToken = newRefreshToken.Token;
            response.Authenticated = true;
            return response;
        }

        public async Task RevokeToken(string token, string ipAddress)
        {
            ApplicationUser account = await getAccountByRefreshToken(token);
            var refreshToken = account.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
                throw new AppException("Invalid token");

            // revoke token and save
            await revokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");
            _context.Update(account);
            await _context.SaveChangesAsync();
        }
        private async Task<bool> IsEmailAndOriginUnique(string email)
        {
            // Check if the email and origin combination exists
            return !_context.Users.Any(u => u.Email == email);
        }
        public CurrentUser GetUserFromClaims(IEnumerable<Claim> claims)
        {
            CurrentUser user = new CurrentUser();
            foreach (Claim c in claims)
            {
                switch (c.Type)
                {
                    case ClaimTypes.NameIdentifier:
                        user.ID = c.Value;
                        break;
                    case ClaimTypes.Name:
                        user.UserName = c.Value;
                        break;
                    case ClaimTypes.Role:
                        user.Roles = c.Value;
                        break;
                }
            }
            return user;
        }
        public async Task<ApiResponse<string>> Register(RegisterRequest request)
        {

            var userToRegister = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                FirstName = request.FirstName,
                LastName = request.LastName,
                CreatedBy = request.Email
            };

            var registrationResult = await _userManager.CreateAsync(userToRegister, request.Password);

            if (registrationResult.Succeeded)
            {
                var created_user = await _userManager.FindByEmailAsync(request.Email);
                await _userManager.AddToRoleAsync(created_user, AuthorizationConstants.UserRole);
                var account = _mapper.Map<ApplicationUser>(request);
                created_user.VerificationToken = await generateVerificationToken();
                await _userManager.UpdateAsync(created_user);
                await sendVerificationEmail(created_user, request.Password);
                return ApiResponse<string>.SuccessResponse("Registration successful. Please check your email for verification instructions.");
            }
            var errorMessage = string.Join(", ", registrationResult.Errors.First().Description);
            return ApiResponse<string>.ErrorResponse("Registration failed: " + errorMessage);
        }

        public async Task<ApiResponse<string>> RegisterCrew(RegisterRequest request)
        {
            var crew = await _crewService.GetCrewByEmailAsync(request.Email);
            if (!crew.IsSuccess && crew.Data == null)
            {
                return ApiResponse<string>.ErrorResponse($"Crew with email '{request.Email}' not found.", HttpStatusCode.NotFound);
            }

            var userToRegister = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                CreatedBy = "superuser@nmdb.com"
            };

            var registrationResult = await _userManager.CreateAsync(userToRegister, request.Password);

            if (registrationResult.Succeeded)
            {
                var created_user = await _userManager.FindByEmailAsync(request.Email);
                await _userManager.AddToRoleAsync(created_user, AuthorizationConstants.CrewRole);
                var account = _mapper.Map<ApplicationUser>(request);
                account.VerificationToken = await generateVerificationToken();
                await sendVerificationEmail(account, request.Password);
                return ApiResponse<string>.SuccessResponse("Registration successful. Please check your email for verification instructions.");
            }
            var errorMessage = string.Join(", ", registrationResult.Errors.First().Description);
            return ApiResponse<string>.ErrorResponse("Registration failed: " + errorMessage);
        }

        public async Task VerifyEmail(string token)
        {
            var account = await _userManager.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);

            if (account == null)
                throw new AppException("Verification failed");

            account.Verified = DateTime.UtcNow;
            account.EmailConfirmed = true;
            account.VerificationToken = null;

            await _userManager.UpdateAsync(account);
        }

        public async Task ForgotPassword(ForgotPasswordRequest model)
        {
            var account = _context.Users.SingleOrDefault(x => x.Email == model.Email);

            // always return ok response to prevent email enumeration
            if (account == null) return;

            // create reset token that expires after 1 day
            account.ResetToken = await generateResetToken();
            account.ResetTokenExpires = DateTime.UtcNow.AddDays(1);

            _context.Users.Update(account);
            await _context.SaveChangesAsync();

            // send email
            await sendPasswordResetEmail(account);
        }

        public async Task ValidateResetToken(ValidateResetTokenRequest model)
        {
            await getAccountByResetToken(model.Token);
        }

        public async Task ResetPassword(ResetPasswordRequest model)
        {
            var account = await getAccountByResetToken(model.Token);

            // update password and remove reset token
            account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            account.PasswordReset = DateTime.UtcNow;
            account.ResetToken = null;
            account.ResetTokenExpires = null;

            _context.Users.Update(account);
            await _context.SaveChangesAsync();
        }

        public async Task<PaginationResponseOld<AccountResponse>> GetAll(int pageNumber, int pageSize, string keyword)
        {
            var query = _context.Users.AsQueryable();
            query = query.Where(p => (p.FirstName.Contains(keyword) || p.LastName.Contains(keyword) || p.Email.Contains(keyword)));
            int totalCount = query.Count();
            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            var Users = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var result = new PaginationResponseOld<AccountResponse>
            {
                Data = _mapper.Map<IList<AccountResponse>>(Users),
                TotalCount = totalCount,
                TotalPages = totalPages
            };
            return result;
        }

        public async Task<AccountResponse> GetByIdx(string idx)
        {
            var account = await getAccount(idx);
            return _mapper.Map<AccountResponse>(account);
        }
        public async Task<AccountResponse> GetById(string id)
        {
            var account = await getAccountById(id);
            return _mapper.Map<AccountResponse>(account);
        }

        public async Task<AccountResponse> Create(CreateRequest model)
        {
            // validate
            if (_context.Users.Any(x => x.Email == model.Email))
                throw new AppException($"Email '{model.Email}' is already registered");

            // map model to new account object
            var account = _mapper.Map<ApplicationUser>(model);
            //account.Created = DateTime.UtcNow;
            account.Verified = DateTime.UtcNow;
            //account.Idx =
            // hash password
            account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            //account.Idx = UniqueIndexGenerator.GenerateUniqueAlphanumericIndex(length: 12, prefix: "acc");
            account.VerificationToken = await generateVerificationToken();

            // save account
            _context.Users.Add(account);
            await _context.SaveChangesAsync();

            // send email
            await sendVerificationEmail(account, model.Password);
            return _mapper.Map<AccountResponse>(account);
        }

        public async Task<AccountResponse> Update(string idx, Application.Models.UpdateUserDTO model)
        {
            var account = await getAccount(idx);

            // validate
            if (account.Email != model.Email && _context.Users.Any(x => x.Email == model.Email))
                throw new AppException($"Email '{model.Email}' is already registered");

            // hash password if it was entered
            if (!string.IsNullOrEmpty(model.Password))
                account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            // copy model to account and save
            _mapper.Map(model, account);
            account.Updated = DateTime.UtcNow;
            _context.Users.Update(account);
            await _context.SaveChangesAsync();

            return _mapper.Map<AccountResponse>(account);
        }

        public async Task Delete(string idx)
        {
            var account = await getAccount(idx);
            _context.Users.Remove(account);
            await _context.SaveChangesAsync();
        }

        // helper methods

        private async Task<ApplicationUser> getAccount(string idx)
        {
            var account = await _userManager.Users.Include(u => u.RefreshTokens).SingleOrDefaultAsync(u => u.Id == idx);
            if (account == null) throw new KeyNotFoundException("Account not found");
            return account;
        }
        private async Task<ApplicationUser> getAccountById(string id)
        {
            var account = await _userManager.Users.Include(u => u.RefreshTokens).SingleOrDefaultAsync(u => u.Id == id);
            if (account == null) throw new KeyNotFoundException("Account not found");
            return account;
        }
        private async Task<ApplicationUser> getAccountByRefreshToken(string token)
        {
            var account = await _userManager.Users.Include(u => u.RefreshTokens).SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));
            if (account == null) throw new AppException("Invalid token");
            return account;
        }

        private async Task<ApplicationUser> getAccountByResetToken(string token)
        {
            var account = await _userManager.Users.Include(u => u.RefreshTokens).SingleOrDefaultAsync(x =>
                x.ResetToken == token && x.ResetTokenExpires > DateTime.UtcNow);
            if (account == null) throw new AppException("Invalid token");
            return account;
        }

        private async Task<string> generateResetToken()
        {
            // token is a cryptographically strong random sequence of values
            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));

            // ensure token is unique by checking against db
            var tokenIsUnique = !_userManager.Users.Any(x => x.ResetToken == token);
            if (!tokenIsUnique)
                return await generateResetToken();

            return token;
        }

        private async Task<string> generateVerificationToken()
        {
            // token is a cryptographically strong random sequence of values
            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));

            // ensure token is unique by checking against db
            var tokenIsUnique = !_userManager.Users.Any(x => x.VerificationToken == token);
            if (!tokenIsUnique)
                return await generateVerificationToken();

            return token;
        }

        private async Task<RefreshToken> rotateRefreshToken(RefreshToken refreshToken, string ipAddress)
        {
            var newRefreshToken = await _jwtTokenGenerator.GenerateRefreshToken(ipAddress);
            await revokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);
            return newRefreshToken;
        }

        private async Task removeOldRefreshTokens(ApplicationUser account)
        {
            account.RefreshTokens.RemoveAll(x =>
               !x.IsActive &&
               x.Created.AddDays(_appSettings.RefreshTokenExpirationInDays) <= DateTime.UtcNow);
        }

        private async Task revokeDescendantRefreshTokens(RefreshToken refreshToken, ApplicationUser account, string ipAddress, string reason)
        {
            // recursively traverse the refresh token chain and ensure all descendants are revoked
            if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
            {
                var childToken = account.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);
                if (childToken.IsActive)
                    await revokeRefreshToken(childToken, ipAddress, reason);
                else
                    await revokeDescendantRefreshTokens(childToken, account, ipAddress, reason);
            }
        }

        private async Task revokeRefreshToken(RefreshToken token, string ipAddress, string reason = null, string replacedByToken = null)
        {
            token.Revoked = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReasonRevoked = reason;
            token.ReplacedByToken = replacedByToken;
        }

        private async Task sendVerificationEmail(ApplicationUser account, string password = "")
        {
            string hostUrl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}"; // make it global later
            string verificationLink = $"{hostUrl}/api/{account.VerificationToken}/verify-email";

            string emailContent = GetVerificationEmailContent(verificationLink, account.FirstName);

            await _emailService.Send(
                 to: account.Email,
                 subject: "Verify Email",
                 html: emailContent
             );
        }

        private string GetVerificationEmailContent(string verificationLink, string username = "")
        {
            // var emailTemplate = @"
            // <!DOCTYPE html>
            // <html lang=""en"">
            // <head>
            //     <meta charset=""UTF-8"">
            //     <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
            //     <title>Email Verification</title>
            // </head>
            // <body>
            //     <div style=""font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"">
            //         <h2 style=""color: #333;"">Verify Your Email Address</h2>
            //         <p>Thank you for registering! Please click the button below to verify your email address:</p>
            //         <a href=""{{verificationLink}}"" style=""display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;"">Verify Email</a>
            //         <p>If you did not create an account, you can safely ignore this email.</p>
            //         <p>Thank you,<br>YourApp Team</p>
            //     </div>
            // </body>
            // </html>";



            // Replace placeholder with actual verification link
            //return emailTemplate.Replace("{{verificationLink}}", verificationLink);


            var emailTemplate = $@"
            ${getEmailStyle}
            <div class='email-container'>
            <h2>Welcome to nmdb!</h2>
            <p>Thank you for registering ${username}. Please click the button below to verify your email address and complete your registration.</p>
            <a href='${verificationLink}' class='button'>Verify Email Address</a>
            <p>If the button above does not work, please copy and paste the following URL into your browser:</p>
            <p>${verificationLink}</p>
            </div>";
            return emailTemplate;

        }

        private string getEmailStyle()
        {
            string cssStyles = @"
                            <style>
                            .email-container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: #fff;
                                padding: 20px;
                                text-align: center;
                                border: 1px solid #dedede;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            }
                            .button {
                                display: inline-block;
                                padding: 10px 20px;
                                margin-top: 20px;
                                background-color: #007bff;
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 5px;
                                font-weight: bold;
                                border: none;
                                cursor: pointer;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            </style>";
            return cssStyles;

        }


        private async Task sendAlreadyRegisteredEmail(string email, string username = "", string loginLink = "")
        {
            string message = $@"<div class='email-container'>
                                <p>Hello ${username},</p>
                                <p>Our records show that you are already registered with us. Here's a quick way to access your account:</p>
                                <a href='${loginLink}' class='button'>Login to Your Account</a>
                                <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                                <p>Thank you for being a part of our community!</p>
                                <p>${getCompanySignature}</p>
                                </div>";

            await _emailService.Send(
                to: email,
                subject: "Email Already Registered",
                html: $@"<h4>Email Already Registered</h4>
                        <p>Your email <strong>{email}</strong> is already registered.</p>
                        {message}"
            );
        }
        private string getCompanySignature()
        {
            string companySignature = $@"<p>Thank you,<br>YourApp Team</p>";
            return companySignature;
        }

        private async Task sendPasswordResetEmail(ApplicationUser account)
        {
            // string message = $@"<p>Please use the below token to reset your password with the <code>/Users/reset-password</code> api route:</p>
            //                 <p><code>{account.ResetToken}</code></p>";

            string message = $@"${getEmailStyle}<div class='email-container'>
                            <h2>Password Reset Request</h2>
                            <p>Dear ${account.UserName},</p>
                            <p>You have requested to reset your password. Please click the button below to set a new password:</p>
                            <a href='{account.ResetToken}' class='button'>Reset Password</a>
                            <p>If the button above does not work, please copy and paste the following URL into your browser:</p>
                            <p>{account.ResetToken}</p>
                            <p>If you did not request a password reset, please ignore this email or contact support.</p>
                            </div>";


            await _emailService.Send(
                to: account.Email,
                subject: "Reset Password",
                html: message
            );
        }
    }
}
