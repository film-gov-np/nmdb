namespace Core.Entities;

public abstract class BaseEntity<TId>:IBaseEntity<TId>
{
    public TId Id { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
