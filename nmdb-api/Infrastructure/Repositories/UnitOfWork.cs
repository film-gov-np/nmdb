using Application.Interfaces;
using Application.Interfaces.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
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
        private IRolesRepository _rolesRepository;
        private IFilmRoleCategoryRepository _filmRoleCategoryRepository;
        private IFilmRoleRepository _filmRoleRepository;

        public UnitOfWork(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IRolesRepository RolesRepository => _rolesRepository ??= new RolesRepository(_context);
        public IFilmRoleCategoryRepository FilmRoleCategoryRepository => _filmRoleCategoryRepository ??= new FilmRoleCategoryRepository(_context);
        public IFilmRoleRepository FilmRoleRepository => _filmRoleRepository ??= new FilmRoleRepository(_context);

        public async Task CommitAsync(CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
