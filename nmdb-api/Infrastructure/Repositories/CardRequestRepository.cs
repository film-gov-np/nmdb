using Application.Dtos;
using Application.Interfaces.Repositories;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class CardRequestRepository : EfRepository<CardRequest>, ICardRequestRepository
    {
        public CardRequestRepository(AppDbContext dbContext) : base(dbContext)
        {

        }
    }
}
