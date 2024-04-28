using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories;


public class CrewRepository : EfRepository<Crew>, ICrewRepository
{
    public CrewRepository(AppDbContext dbContext) : base(dbContext)
    {

    }
}



