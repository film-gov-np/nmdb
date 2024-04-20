namespace Core.Entities;

public class MovieType : BaseEntity<int>
{
    public string Type { get; set; }
    public string? Description { get; set; }
}
