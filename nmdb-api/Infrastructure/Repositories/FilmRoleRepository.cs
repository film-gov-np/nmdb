using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class FilmRoleRepository: EfRepository<FilmRole>, IFilmRoleRepository
{
    public FilmRoleRepository(AppDbContext dbContext) : base(dbContext)
    {

    }
}