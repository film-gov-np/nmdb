

using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class TheatreRepository:EfRepository<Theatre>,ITheatreRepository
{
    public TheatreRepository(AppDbContext dbContext) : base(dbContext)
    {

    }
}
