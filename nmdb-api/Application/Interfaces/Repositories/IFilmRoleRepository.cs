using Core.Entities;

namespace Application.Interfaces.Repositories;

public interface IFilmRoleRepository : IEfRepository<FilmRole>
{
    Task<IEnumerable<FilmRole>> GetRolesByIdsAsync(IEnumerable<int> roleIds);
}
