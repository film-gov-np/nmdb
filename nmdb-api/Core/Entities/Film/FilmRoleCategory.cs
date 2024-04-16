namespace Core.Entities;

public class FilmRoleCategory : BaseEntity<int>
{
    public string CategoryName { get; set; }
    public int DisplayOrder { get; set; }
    public virtual List<FilmRole> Roles { get; set; }
}
