using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities;

public class Genre : BaseEntity<int>
{
    public string Name { get; set; }
    public string? NepaliName { get; set; }
    private ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();
    [NotMapped]
    public ICollection<Movie> Movies => MovieGenres.Select(mg => mg.Movie).ToList();
}
