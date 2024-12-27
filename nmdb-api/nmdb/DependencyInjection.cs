using Application.Dtos.Media;
using FastEndpoints;
using FastEndpoints.Swagger;
using MediatR;
using Neptics.Application.Helpers;
using nmdb.Configurations;
using nmdb.Middlewares;
using System.Reflection;
using System.Text.Json;

namespace nmdb;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder =>
                {
                    builder.WithOrigins("https://nmdb-phi.vercel.app", "https://nmdb-api.nepalidev.com.np/", "http://localhost:5173", "https://nmdb-git-main-neptics.vercel.app/", "https://nmdb.azurewebsites.net","https://nmdb.gov.np","https://nmdb.film.gov.np")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials();
                });
        });
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });
        services.AddEndpointsApiExplorer();

        services.AddLogging(loggingBuilder =>
        {
            loggingBuilder.AddConsole();
        });
        services.Configure<AllowedUploadFiles>(configuration.GetSection(AllowedUploadFiles.Section));


        services.AddFastEndpoints()
                        .SwaggerDocument(o =>
                        {
                            //o.EnableJWTBearerAuth = true; // activated automatically
                            o.ShortSchemaNames = true;
                            // Grouping of endpoints api/auth/register will be grouped in Auth
                            o.AutoTagPathSegmentIndex = 2;
                            o.DocumentSettings = s =>
                            {
                                s.DocumentName = "Initial-Release";
                                s.Title = "NMDB Web API";
                                s.Version = "v1.0";
                                //s.AddAuth("Bearer", new()
                                //{
                                //    Type = OpenApiSecuritySchemeType.Http,
                                //    Scheme = JwtBearerDefaults.AuthenticationScheme,
                                //    BearerFormat = "JWT",
                                //});
                            };
                        });

        services.AddCoreAdmin();
        //services.AddTransient<AuthorizedUserMiddleware>();
        services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);
        services.AddAutoMapper(typeof(MappingProfile).Assembly);
        ConfigureMediatR();

        void ConfigureMediatR()
        {
            var mediatRAssemblies = new[]
          {
            Assembly.GetAssembly(typeof(Application.AssemblyReference))
            };
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(mediatRAssemblies!));
            //builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            //builder.Services.AddScoped<IDomainEventDispatcher, MediatRDomainEventDispatcher>();
        }
        return services;
    }

}