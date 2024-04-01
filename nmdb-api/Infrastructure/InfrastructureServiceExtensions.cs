using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Infrastructure.Data;
using Infrastructure.Email;
using Infrastructure.Identity;
using Microsoft.VisualBasic.FileIO;
using Application.Interfaces;

namespace Infrastructure;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration config)    {
        services.AddDbContext<AppDbContext>(c =>
                        c.UseSqlServer(config.GetConnectionString("DefaultConnection")));

        // Register your services here
        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<IJwtUtils, JwtUtils>();
        


        return services;
    }
}
