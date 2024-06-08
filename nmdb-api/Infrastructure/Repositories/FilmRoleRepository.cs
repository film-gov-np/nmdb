using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class FilmRoleRepository : EfRepository<FilmRole>, IFilmRoleRepository
{
    private readonly AppDbContext _context;
    public FilmRoleRepository(AppDbContext dbContext) : base(dbContext)
    {
        _context = dbContext;
    }

    public async Task<IEnumerable<FilmRole>> GetAllRoles()
    {
        try
        {
            var allRoles = await _context.FilmRoles.ToListAsync();
            return allRoles;
        }

        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<IEnumerable<int>> GetRolesByIdsAsync(IEnumerable<int> roleIds)
    {
        return await Get(r => roleIds.Contains(r.Id)).Select(s => s.Id).ToListAsync();
    }
}