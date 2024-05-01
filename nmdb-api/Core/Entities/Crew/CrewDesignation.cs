
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;
public class CrewDesignation : BaseEntity<int>
{
    public int CrewId { get; set; }

    [ForeignKey(nameof(CrewId))]
    public virtual Crew Crew { get; set; }
    public int RoleId { get; set; }

    [ForeignKey(nameof(RoleId))]
    public virtual FilmRole FilmRole { get; set; }
}