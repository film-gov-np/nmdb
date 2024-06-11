using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure;
using Application;
using nmdb;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using nmdb.Middlewares;
using Application.Dtos.Media;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddPresentation(builder.Configuration)
    .AddApplication(builder.Configuration)
    .AddInfrastructure(builder.Configuration);


var app = builder.Build();

app.Configuration.GetSection("AllowedUploadFiles").Get<AllowedUploadFiles>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseFastEndpoints()
    .UseSwaggerGen();

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

//app.UseMiddleware<AuthorizedUserMiddleware>();
//app.UseMiddleware<CamelCaseResponseMiddleware>();

app.MapControllers();
app.MapDefaultControllerRoute();

// .NET 8 Identity Endpoints mapping
//app.MapGet("api/required-auth", (ClaimsPrincipal user) => $"Hello, {user.Identity?.Name}!")
//    .RequireAuthorization();

//app.MapGroup("api/identity")
//    .MapCustomIdentityApi<ApplicationUser>();

//SeedDatabase(app);
app.Run();
async void SeedDatabase(WebApplication app)
{

    using (var scope = app.Services.CreateScope())
    {
        var scopedProvider = scope.ServiceProvider;
        try
        {
            //var appDbContext = scopedProvider.GetRequiredService<AppDbContext>();
            //await AppDbContextSeed.SeedAsync(appDbContext, app.Logger);

            var userManager = scopedProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scopedProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            //var roleManager = scopedProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var identityContext = scopedProvider.GetRequiredService<AppDbContext>();
            await AppIdentitySeed.SeedAsync(identityContext, userManager,roleManager);
        }
        catch (Exception ex)
        {
            app.Logger.LogError(ex, "An error occurred seeding the DB.");
        }
    }
}
