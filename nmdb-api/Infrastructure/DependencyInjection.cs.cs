﻿using Application.Interfaces;
using Infrastructure.Data;
using Infrastructure.Email;
using Infrastructure.Identity;
using Infrastructure.Identity.Security.TokenGenerator;
using Infrastructure.Identity.Security.TokenValidation;
using Infrastructure.Identity.Services;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        services.Configure<EmailSettings>(configuration.GetSection(EmailSettings.Section));
        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        return services;
    }

    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(c =>
                    c.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

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
            .AddAuthentication(defaultScheme: JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();
        return services;
    }
}