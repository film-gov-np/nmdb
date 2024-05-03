using Application.Interfaces.Repositories;
using System;

namespace Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRolesRepository RolesRepository { get; }
        IFilmRoleRepository FilmRoleRepository { get; }
        IFilmRoleCategoryRepository FilmRoleCategoryRepository { get; }
        ICrewRepository CrewRepository { get; }
        ITheatreRepository TheatreRepository { get; }
        Task CommitAsync(CancellationToken cancellationToken = default);
        Task BeginTransactionAsync();
        void Rollback();
    }
}
