using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class MovieLanguage : BaseEntity<int>
{
    [ForeignKey("Movie")] // not necessary if we follow standard naming convention
    public int MovieId { get; set; }
    public Movie Movie { get; set; }

    [ForeignKey("Language")]
    public int LanguageId { get; set; }
    public Language Language { get; set; }
}
