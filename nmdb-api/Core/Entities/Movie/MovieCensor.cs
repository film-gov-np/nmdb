using Core.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities;

[Table("MovieCensorInfo")]
public class MovieCensor : BaseEntity<int>
{    
    public int MovieId { get; set; }
    public Movie Movie { get; set; }
    [MaxLength(255)]
    public string CertificateNumber { get; set; } = "NA";
    public DateTime? ApplicationDate { get; set; }
    public DateTime? CensoredDate { get; set; }
    public eCensorType CensorType { get; set; }
    public eMovieType MovieType { get; set; }
    [MaxLength(255)]
    public string ReelLength { get; set; } = "NA";
    [MaxLength(255)]
    public string ReelSize { get; set; } = "NA";
    [Column("ValidYears")]
    public int ValidForInYears { get; set; } = 10;
    public string? Description { get; set; }
}

