using Application.Interfaces.Repositories;

namespace Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {        
        IRolesRepository RolesRepository { get; }
        IFilmRoleRepository FilmRoleRepository { get; }
        IFilmRoleCategoryRepository FilmRoleCategoryRepository { get; }
        Task CommitAsync(CancellationToken cancellationToken = default);
    }
}
