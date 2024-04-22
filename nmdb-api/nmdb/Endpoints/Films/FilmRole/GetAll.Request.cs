using FastEndpoints;

namespace nmdb.Endpoints.Films.FilmRole
{
    public class GetAllFilmRolesRequest
    {
        public const string Route = "api/film/roles";
        
        [QueryParam, BindFrom("pageNo")]
        public int PageNumber { get; set; } = 1;

        [QueryParam, BindFrom("pageSize")]
        public int PageSize { get; set; } = 10;
        //[QueryParam, BindFrom("searchKeyword")]

        public string? SearchKeyword { get; set; }
    }
}
