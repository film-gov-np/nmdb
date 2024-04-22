using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class MovieGenre : BaseEntity<int>
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int MovieId { get; set; }
    public Movie Movie { get; set; }


    public int GenreId { get; set; }
    public Genre Genre { get; set; }
}
