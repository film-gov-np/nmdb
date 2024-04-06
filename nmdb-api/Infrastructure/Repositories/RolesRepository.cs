using Application.Interfaces;
using Application.Interfaces.Repositories;
using Application.Models;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class RolesRepository : EfRepository<Roles>, IRolesRepository
    {
        public RolesRepository(AppDbContext dbContext) : base(dbContext)
        {

        }
    }
}
