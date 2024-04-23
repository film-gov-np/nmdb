
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

[Table("MovieStatus")]
public class MovieStatus : BaseEntity<int>
{
    public string Status { get; set; }
    public int? DisplayOrder { get; set; }
}
