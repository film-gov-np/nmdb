using Core.Constants;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.Dtos.Movie;

public class MovieCensorDto
{
    public string? CertificateNumber { get; set; }
    public DateTime? ApplicationDate { get; set; }
    public DateTime? CensoredDate { get; set; }
    public eCensorType? CensorType { get; set; } = eCensorType.PG;
    public eMovieType? MovieType { get; set; } = eMovieType.Celluloid;
    public string? ReelLength { get; set; }
    public string? ReelSize { get; set; }
    public int? ValidForInYears { get; set; }
    public string? Description { get; set; }
}
