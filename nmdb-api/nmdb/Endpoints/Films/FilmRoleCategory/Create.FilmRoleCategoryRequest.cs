namespace nmdb.Endpoints.Films.FilmRoleCategory;

public class CreateFilmRoleCategoryRequest
{
    public string Name { get; set; }
    public int DisplayOrder { get; set; }
    public CreateFilmRoleCategoryRequest(string name, int displayOrder)
    {
        Name = name;
        DisplayOrder = displayOrder;
    }
}