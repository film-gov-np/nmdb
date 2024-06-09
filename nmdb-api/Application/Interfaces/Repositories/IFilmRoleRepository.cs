using Core.Entities;

namespace Application.Interfaces.Repositories;

public interface IFilmRoleRepository : IEfRepository<FilmRole>
{
    Task<IEnumerable<int>> GetRolesByIdsAsync(IEnumerable<int> roleIds);
    Task<IEnumerable<FilmRole>> GetAllRoles ();
}
