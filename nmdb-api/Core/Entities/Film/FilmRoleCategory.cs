namespace Core.Entities;

public class FilmRoleCategory : BaseEntity<int>
{
    public string CategoryName { get; set; }
    public int DisplayOrder { get; set; }

    public ICollection<FilmRole> Roles { get; set; }
}
