using Application.Dtos;
using Application.Models;
using Core.Entities;
using Core.Entities.Film;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
namespace Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) :
        base(options)
    { }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<FilmProduction> FilmProductions { get; set; }
    public DbSet<ProductionHouse> ProductionHouses { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Language> Languages { get; set; }
    public DbSet<Studio> Studios { get; set; }
    public DbSet<Theatre> Theatres { get; set; }
    public DbSet<FilmRoleCategory> FilmRoleCategory { get; set; }
    public DbSet<FilmRole> FilmRoles { get; set; }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<Crew> Crews { get; set; }
    public DbSet<CrewDesignation> CrewRoles { get; set; }
    public DbSet<MovieCrewRole> MovieCrewRoles { get; set; }
    public DbSet<MovieCensor> MovieCensors { get; set; }
    public DbSet<MovieGenre> MovieGenre { get; set; }
    public DbSet<MovieLanguage> MovieLanguages { get; set; }
    //public DbSet<MovieStudio> MovieStudios { get; set; }
    public DbSet<MovieProductionHouse> MovieProductionHouses { get; set; }

    public DbSet<MovieTheatre> MovieTheatres { get; set; }

    public DbSet<MovieType> MovieTypes { get; set; }
    public DbSet<MovieStatus> MovieStatus { get; set; }
    public DbSet<CardRequest> CardRequests { get; set; }

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


        builder.Entity<Crew>()
            .HasIndex(c=>c.Email)
            .IsUnique();

        // Crew Role/Designation
        builder.Entity<CrewDesignation>()
            .HasKey(cr => new { cr.CrewId, cr.RoleId });

        builder.Entity<CrewDesignation>()
            .HasOne(cr => cr.Crew)
            .WithMany(c => c.CrewDesignations)
            .HasForeignKey(cr => cr.CrewId);

        builder.Entity<CrewDesignation>()
            .HasOne(cr => cr.FilmRole)
            .WithMany(r => r.CrewRoles)
            .HasForeignKey(cr => cr.RoleId);


        // Configure many-to-many relationship between Movie, Crew, and Role using MovieCrewRole
        builder.Entity<MovieCrewRole>()
            .HasKey(mcr => new { mcr.MovieId, mcr.CrewId, mcr.RoleId });

        builder.Entity<MovieCrewRole>()
            .HasOne(mcr => mcr.Movie)
            .WithMany(m => m.MovieCrewRoles)
            .HasForeignKey(mcr => mcr.MovieId);

        builder.Entity<MovieCrewRole>()
            .HasOne(mcr => mcr.Crew)
            .WithMany(c => c.MovieCrewRoles)
            .HasForeignKey(mcr => mcr.CrewId);

        builder.Entity<MovieCrewRole>()
            .HasOne(mcr => mcr.FilmRole)
            .WithMany(r => r.MovieCrewRoles)
            .HasForeignKey(mcr => mcr.RoleId);


        // Movie Genre
        builder.Entity<MovieGenre>()
            .HasKey(mcr => new { mcr.MovieId, mcr.GenreId });

        builder.Entity<MovieGenre>()
            .HasOne(mcr => mcr.Movie)
            .WithMany(m => m.MovieGenres)
            .HasForeignKey(mcr => mcr.MovieId);

        builder.Entity<MovieGenre>()
            .HasOne(mcr => mcr.Genre)
            .WithMany(c => c.MovieGenres)
            .HasForeignKey(mcr => mcr.GenreId);


        // Movie Language
        builder.Entity<MovieLanguage>()
            .HasKey(mcr => new { mcr.MovieId, mcr.LanguageId });

        builder.Entity<MovieLanguage>()
            .HasOne(mcr => mcr.Movie)
            .WithMany(m => m.MovieLanguages)
            .HasForeignKey(mcr => mcr.MovieId);

        builder.Entity<MovieLanguage>()
            .HasOne(mcr => mcr.Language)
            .WithMany(m => m.MovieLanguages)
            .HasForeignKey(mcr => mcr.LanguageId);


        // Movie Production House
        builder.Entity<MovieProductionHouse>()
             .HasKey(mcr => new { mcr.MovieId, mcr.ProductionHouseId });

        builder.Entity<MovieProductionHouse>()
            .HasOne(mcr => mcr.Movie)
            .WithMany(m => m.MovieProductionHouses)
            .HasForeignKey(mcr => mcr.MovieId);

        builder.Entity<MovieProductionHouse>()
            .HasOne(mcr => mcr.ProductionHouse)
            .WithMany(m => m.MovieProductionHouses)
            .HasForeignKey(mcr => mcr.ProductionHouseId);


        // Movie Theatre
        builder.Entity<MovieTheatre>()
            .HasKey(mt => new { mt.MovieId, mt.TheatreId });

        builder.Entity<MovieTheatre>()
            .HasOne(mt => mt.Movie)
            .WithMany(mt => mt.MovieTheatres)
            .HasForeignKey(mt => mt.MovieId);

        builder.Entity<MovieTheatre>()
            .HasOne(mt => mt.Theatre)
            .WithMany(mt => mt.MovieTheatres)
            .HasForeignKey(mt => mt.TheatreId);
    }
}
