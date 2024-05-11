using Application.Dtos.Media;
using Application.Helpers;
using Application.Interfaces.Services;
using Application.Services;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        // MediatR and other application services
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<IFilmRoleService, FilmRoleService>();
        services.AddScoped<IFilmRoleCategoryService, FilmRoleCategoryService>();
        services.AddScoped<ICrewService, CrewService>();
        services.AddScoped<ITheatreService, TheatreService>();
        services.AddScoped<IProductionHouseService, ProductionHouseService>();
        services.AddScoped<IMovieService, MovieService>();
        services.AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<AssemblyReference>());
        return services;
    }
}
