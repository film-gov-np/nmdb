using Core.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities;

public class Movie : BaseEntity<int>
{
    [MaxLength(255)]
    public string Name { get; set; }
    [MaxLength(255)]

    public string NepaliName { get; set; }
    public int? Runtime { get; set; }
    [MaxLength(100)]
    public string? Color { get; set; }
    public DateTime? ShootingDate { get; set; }
    [MaxLength(16)]
    public string? ShootingDateBS { get; set; }
    public DateTime? ReleaseDate { get; set; }
    [MaxLength(16)]
    public string? ReleaseDateBS { get; set; }
    [MaxLength(50)]
    //public string Category { get; set; } = "Movie";
    public eMovieCategory Category { get; set; } = eMovieCategory.Movie;
    public eMovieStatus Status { get; set; } = eMovieStatus.Released;    
    [MaxLength(255)]
    public string? OfficialSiteUrl { get; set; }
    public decimal? Budget { get; set; }
    [MaxLength(255)]
    public string? FilmingLocation { get; set; }   
    public string Tagline { get; set; }
    public string OneLiner{ get; set; }
    [MaxLength(255)]
    public string? Image { get; set; }
    [MaxLength(255)]
    public string? FullMovieLink { get; set; }
    [MaxLength(255)]
    public string? TrailerLink { get; set; }
    public bool IsTrending { get; set; } = false;
    public bool IsFeatured { get; set; } = false;

    // Navigational Properties
    public MovieCensor Censor { get; set; }
    public ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();
    [NotMapped]
    public ICollection<Genre> Genres => MovieGenres.Select(ml => ml.Genre).ToList();

    public ICollection<MovieLanguage> MovieLanguages { get; set; } = new List<MovieLanguage>();
    [NotMapped]
    public ICollection<Language> Languages => MovieLanguages.Select(ml => ml.Language).ToList();

    public ICollection<MovieCrewRole> MovieCrewRoles { get; set; } = new List<MovieCrewRole>();
    public ICollection<MovieTheatre> MovieTheatres { get; set; } = new List<MovieTheatre>();
    public ICollection<MovieProductionHouse> MovieProductionHouses { get; set; } = new List<MovieProductionHouse>();

}
