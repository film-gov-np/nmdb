﻿using Application.Abstractions;
using Application.Helpers;
using Application.Interfaces;
using Core;
using Infrastructure.Data;
using Infrastructure.Email;
using Infrastructure.Identity;
using Infrastructure.Identity.Security.TokenGenerator;
using Infrastructure.Identity.Security.TokenValidation;
using Infrastructure.Identity.Services;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddHttpContextAccessor()
            .AddServices(configuration)
            .AddAuthentication(configuration)
            .AddAuthorization()
            .AddPersistence(configuration);
        return services;
    }
    private static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IService, RestService>();
        services.Configure<EmailSettings>(options =>
        {
            options.SmtpHost = Environment.GetEnvironmentVariable("EMAIL_HOST") ?? configuration["EmailSettings:SmtpHost"] ?? throw new ArgumentNullException("SmtpHost configuration is missing.");
            options.SmtpPort = int.TryParse(Environment.GetEnvironmentVariable("EMAIL_PORT") ?? configuration["EmailSettings:SmtpPort"], out int smtpPort) ? smtpPort : throw new ArgumentException("SmtpPort configuration is invalid or missing.");
            options.SmtpUsername = Environment.GetEnvironmentVariable("EMAIL_USERNAME") ?? configuration["EmailSettings:SmtpUsername"] ?? throw new ArgumentNullException("SmtpUsername configuration is missing.");
            options.SmtpPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD") ?? configuration["EmailSettings:SmtpPassword"] ?? throw new ArgumentNullException("SmtpPassword configuration is missing.");
            options.SenderName = Environment.GetEnvironmentVariable("EMAIL_SENDER_NAME") ?? configuration["EmailSettings:SenderName"] ?? throw new ArgumentNullException("SenderName configuration is missing.");
            options.SenderEmail = Environment.GetEnvironmentVariable("EMAIL_SENDER_EMAIL") ?? configuration["EmailSettings:SenderEmail"] ?? throw new ArgumentNullException("SenderEmail configuration is missing.");
            options.CcTo = Environment.GetEnvironmentVariable("EMAIL_CCTO") ?? configuration["EmailSettings:CcTo"] ?? throw new ArgumentNullException("CcTo configuration is missing.");
            options.BccTo = Environment.GetEnvironmentVariable("EMAIL_BCCTO") ?? configuration["EmailSettings:BccTo"] ?? throw new ArgumentNullException("BccTo configuration is missing.");
        });
        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<ApiResponse>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        return services;
    }

    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = Environment.GetEnvironmentVariable("NMDB_CONNECTION_STRING")?? configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(c =>
                    c.UseSqlServer(connectionString));

        return services;
    }

    private static IServiceCollection AddAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.Section));
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddIdentityApiEndpoints<ApplicationUser>()
            .AddRoles<ApplicationRole>()
            .AddEntityFrameworkStores<AppDbContext>();
        services
            .ConfigureOptions<JwtBearerTokenValidationConfiguration>()
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                // Options to tell the app to read jwt from the cookie
                // by default it will look into the authorization header
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // Read the token from the cookie
                        var token = context.Request.Cookies["accessToken"];
                        if (!string.IsNullOrEmpty(token))
                        {
                            context.Token = token;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

        // If default Authorization header is to be used
        //    .AddAuthentication(options =>
        //        {
        //            options.DefaultAuthenticateScheme = "CustomTokenScheme";
        //            options.DefaultChallengeScheme = "CustomTokenScheme";
        //        })
        //.AddScheme<AuthenticationSchemeOptions, CustomTokenAuthenticationHandler>("CustomTokenScheme", options => { }); ;
        return services;
    }
}
