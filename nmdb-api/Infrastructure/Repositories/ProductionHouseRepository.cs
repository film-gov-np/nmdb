

using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class ProductionHouseRepository:EfRepository<ProductionHouse>,IProductionHouseRepository
{
    public ProductionHouseRepository(AppDbContext dbContext) : base(dbContext)
    {

    }
}
