using Application.Interfaces.Repositories;
using Core.Entities.Awards;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public class AwardsRepository : EfRepository<Awards>, IAwardsRepository
    {
        public AwardsRepository(AppDbContext dbContext) : base(dbContext)
        {

        }
    }
}
