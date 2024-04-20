using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities;

public class Movie : BaseEntity<int>
{
    public string Name { get; set; }
    public string NepaliName { get; set; }
    public int? Runtime { get; set; }
    public string Color { get; set; }
    public DateTime? ShootingDate { get; set; }
    public string ShootingDateBS { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public string ReleaseDateBS { get; set; }
    public string Category { get; set; }
    public string Status { get; set; }
    public string Tagline { get; set; }
    public string OfficialSiteUrl { get; set; }
    public decimal? Budget { get; set; }
    public string FilmingLocation { get; set; }
    public string OneLiner { get; set; }
    public string Image { get; set; }
    public string FullMovieLink { get; set; }
    public string TrailerLink { get; set; }
    public bool IsTrending { get; set; } = false;
    public bool IsFeatured { get; set; } = false;

    private ICollection<MovieGenre> MovieGenres { get; set; }= new List<MovieGenre>();
    [NotMapped]
    public ICollection<Genre> Genres => MovieGenres.Select(ml => ml.Genre).ToList();

    public ICollection<MovieLanguage> MovieLanguages { get; set; } = new List<MovieLanguage>();
    [NotMapped]
    public ICollection<Language> Languages => MovieLanguages.Select(ml => ml.Language).ToList();
}
