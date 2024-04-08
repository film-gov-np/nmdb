using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class FilmRoleCategoryRepository : EfRepository<FilmRoleCategory>, IFilmRoleCategoryRepository
{
    public FilmRoleCategoryRepository(AppDbContext dbContext) : base(dbContext)
    {

    }
}
