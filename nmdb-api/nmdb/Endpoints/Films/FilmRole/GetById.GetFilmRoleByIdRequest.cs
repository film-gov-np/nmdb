namespace nmdb.Endpoints.Films.FilmRole
{
    public class GetFilmRoleByIdRequest
    {
        public const string Route = "api/film/roles/{FilmRoleId:int}";
        public int FilmRoleId { get; set; }
    }
}
