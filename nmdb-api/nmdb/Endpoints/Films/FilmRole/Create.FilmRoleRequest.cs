namespace nmdb.Endpoints.Films.FilmRole
{
    public class CreateFilmRoleRequest
    {
        public const string Route = "api/film/role";
        public string RoleName { get; set; }
        public int RoleCategoryId { get; set; }
        public int DisplayOrder { get; set; }
    }
}
