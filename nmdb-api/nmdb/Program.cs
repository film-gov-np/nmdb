using Application.Helpers;
using Application.Interfaces;
using FastEndpoints;
using FastEndpoints.Swagger;
using Infrastructure;
using Infrastructure.Data;
using Infrastructure.Email;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
//using nmdb.Services;
using Swashbuckle.AspNetCore.Filters;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});
builder.Services.AddControllers();
//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen(options =>
//{
//    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
//    {
//        In = ParameterLocation.Header,
//        Name = "Authorization",
//        Type = SecuritySchemeType.ApiKey
//    });

//    options.OperationFilter<SecurityRequirementsOperationFilter>();
//});

builder.Services.AddFastEndpoints()
                .SwaggerDocument(o =>
                {
                    o.ShortSchemaNames = true;
                });

builder.Services.AddCoreAdmin();


builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddInfrastructureServices(builder.Configuration);

// Configure stringly typed settings
builder.Services.Configure<MailServerConfiguration>(builder.Configuration.GetSection("MailServerConfiguration"));
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("ApiSettings:JwtOptions"));


// Register your services here
//builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<ApplicationRole>()
    .AddEntityFrameworkStores<AppDbContext>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseFastEndpoints()
    .UseSwaggerGen();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthorization();
app.UseCors("AllowSpecificOrigin");


app.MapControllers();
app.MapDefaultControllerRoute();

// .NET 8 Identity Endpoints mapping
app.MapGet("api/required-auth", (ClaimsPrincipal user) => $"Hello, {user.Identity?.Name}!")
    .RequireAuthorization();

app.MapGroup("api/identity")
    .MapCustomIdentityApi<ApplicationUser>();

app.Run();
