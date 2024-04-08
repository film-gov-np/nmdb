namespace nmdb.Endpoints.Films.FilmRoleCategory
{
    public class GetFilmRoleCategoryByIdRequest
    {
        public const string Route = "api/film/role-categories/{RoleCategoryId:int}";
        public int FilmRoleCategoryId { get; set; }
    }
}
