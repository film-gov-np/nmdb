using Application.Models;
using Core.Entities;
using Core.Entities.Film;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) :
        base(options)
    { }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<FilmRoleCategory> FilmRoleCategory { get; set; }
    public DbSet<FilmRole> FilmRoles { get; set; }
    public DbSet<FilmProduction> FilmProductions { get; set; }
    public DbSet<ProductionHouse> ProductionHouses { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // To bypass default Table names assign by .NET Identity
        base.OnModelCreating(builder);
        builder.Entity<ApplicationUser>().ToTable("Users");
        builder.Entity<ApplicationRole>().ToTable("Roles");
        builder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
        builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
        builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");

        builder.Entity<FilmProduction>()
            .HasIndex(fp => fp.SubmissionId)
            .IsUnique();
    }
}
