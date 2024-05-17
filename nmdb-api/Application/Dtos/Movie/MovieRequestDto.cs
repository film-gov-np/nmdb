using Core.Constants;
using Core.Entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Application.Dtos.Movie;

public class MovieRequestDto
{
    public string Name { get; set; }
    public string NepaliName { get; set; }
    public int? Runtime { get; set; }
    public string? Color { get; set; }
    public DateTime? ShootingDate { get; set; }
    public string? ShootingDateBS { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public string? ReleaseDateBS { get; set; }
    public eMovieCategory Category { get; set; } = eMovieCategory.Movie;
    public eMovieStatus Status { get; set; } = eMovieStatus.Released;
    public string? OfficialSiteUrl { get; set; }
    public decimal? Budget { get; set; }
    public string? FilmingLocation { get; set; }
    public string Tagline { get; set; }
    public string OneLiner { get; set; }
    public string? Image { get; set; }
    public IFormFile? ImageFile { get; set; }
    public string? FullMovieLink { get; set; }
    public string? TrailerLink { get; set; }
    public bool IsTrending { get; set; } = false;
    public bool IsFeatured { get; set; } = false;
    public ICollection<int> GenreIds { get; set; }
    public ICollection<int> LanguageIds { get; set; }
    public ICollection<int> ProductionHouseIds { get; set; }
    public ICollection<MovieCrewRoleDto> CrewRoles { get; set; }
    public ICollection<MovieTheatreDto> Theatres { get; set; }    
    public MovieCensorDto Censor { get; set; }

    [JsonIgnore]
    public string? AuditedBy { get; set; }
}
