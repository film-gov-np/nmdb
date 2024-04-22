
namespace Core.Entities;

public class MovieStatus : BaseEntity<int>
{
    public string Status { get; set; }
    public int? DisplayOrder { get; set; }
}
