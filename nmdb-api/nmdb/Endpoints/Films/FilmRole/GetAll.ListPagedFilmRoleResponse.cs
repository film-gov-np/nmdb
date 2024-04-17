using Application.CQRS.FilmRoles.Queries;
using System.Diagnostics.Contracts;

namespace nmdb.Endpoints.Films.FilmRole
{
    public class ListPagedFilmRoleResponse
    {
        public ListPagedFilmRoleResponse() { }
        public List<FilmRoleResponse> FilmRoles { get; set; } = new List<FilmRoleResponse>();
        public int TotalItems { get; set; }
    }
}
