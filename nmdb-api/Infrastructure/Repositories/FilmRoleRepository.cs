using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class FilmRoleRepository : EfRepository<FilmRole>, IFilmRoleRepository
{
    public FilmRoleRepository(AppDbContext dbContext) : base(dbContext)
    {

    }

    public async Task<IEnumerable<int>> GetRolesByIdsAsync(IEnumerable<int> roleIds)
    {
        return await Get(r => roleIds.Contains(r.Id)).Select(s => s.Id).ToListAsync();
    }
}