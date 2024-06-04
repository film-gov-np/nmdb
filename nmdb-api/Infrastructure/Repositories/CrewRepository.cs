using Application.Dtos;
using Application.Interfaces.Repositories;
using Core;
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
    private readonly AppDbContext _context;

    public CrewRepository(AppDbContext dbContext) : base(dbContext)
    {

    }

    public Crew GetCrewByEmail(string email)
    {
        try
        {
            var crew = _context.Crews.FirstOrDefault(x => x.Email == email);
            return crew;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}



