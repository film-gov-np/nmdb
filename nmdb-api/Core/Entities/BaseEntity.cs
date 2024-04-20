using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities;

public abstract class BaseEntity <TId> : IBaseEntity<TId>
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public TId Id { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
}
