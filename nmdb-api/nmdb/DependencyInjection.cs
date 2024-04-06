using FastEndpoints;
using FastEndpoints.Swagger;

namespace nmdb;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
        });     
        
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
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        return services;
    }
}
