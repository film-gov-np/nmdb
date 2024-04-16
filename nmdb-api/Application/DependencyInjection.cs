using Application.Interfaces.Services;
using Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        // MediatR and other application services
        services.AddScoped<IFilmRoleCategoryService, FilmRoleCategoryService>();
        return services;
    }
}
