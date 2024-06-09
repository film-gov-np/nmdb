using Application.Interfaces;
using Application.Interfaces.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction _transaction;
        private IRolesRepository _rolesRepository;
        private IFilmRoleCategoryRepository _filmRoleCategoryRepository;
        private IFilmRoleRepository _filmRoleRepository;
        private ICrewRepository _crewRepository;
        private ITheatreRepository _theatreRepository;
        private IProductionHouseRepository _productionHouseRepository;
        private IMovieRepository _movieRepository;
        private ICardRequestRepository _cardRequestRepository;
        private IAwardsRepository _awardsRepository;

        public UnitOfWork(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IRolesRepository RolesRepository => _rolesRepository ??= new RolesRepository(_context);
        public IFilmRoleCategoryRepository FilmRoleCategoryRepository => _filmRoleCategoryRepository ??= new FilmRoleCategoryRepository(_context);
        public IFilmRoleRepository FilmRoleRepository => _filmRoleRepository ??= new FilmRoleRepository(_context);
        public ICrewRepository CrewRepository => _crewRepository ??= new CrewRepository(_context);
        public ITheatreRepository TheatreRepository => _theatreRepository ??= new TheatreRepository(_context);
        public IProductionHouseRepository ProductionHouseRepository => _productionHouseRepository ??= new ProductionHouseRepository(_context);
        public IMovieRepository MovieRepository => _movieRepository ??= new MovieRepository(_context);
        public ICardRequestRepository CardRequestRepository => _cardRequestRepository ??= new CardRequestRepository(_context); 
        public IAwardsRepository AwardsRepository => _awardsRepository ??= new AwardsRepository(_context);

        public async Task BeginTransactionAsync()
        {
            if (_transaction != null)
            {
                throw new InvalidOperationException("A transaction is already in progress.");
            }

            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync(CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
            _transaction?.Commit();
        }

        public void Rollback()
        {
            _transaction?.Rollback();
        }
        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
