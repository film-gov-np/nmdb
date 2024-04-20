using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class Language : BaseEntity<int>
{
    public string Name { get; set; }
    public string? NepaliName { get; set; }
    public ICollection<MovieLanguage> MovieLanguages { get; set; } = new List<MovieLanguage>();
    [NotMapped]
    public ICollection<Movie> Movies => MovieLanguages.Select(ml => ml.Movie).ToList();
}
