using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Infrastructure.Data;
using Infrastructure.Email;
using Infrastructure.Identity;

namespace Infrastructure
{
    public static class InfrastructureServiceExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            ConfigurationManager config)
        {
            string? connectionString = config.GetConnectionString("NmbdbConnection");
            services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

            //builder.Services.Configure<MailServerConfiguration>(builder.Configuration.GetSection("MailServerConfiguration"));
            //builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("ApiSettings:JwtOptions"));


            return services;
        }
    }
}
