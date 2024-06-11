using Application.Dtos;
using Application.Interfaces.Repositories;
using Core;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
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
        _context = dbContext;
    }

    public async Task<Crew> GetCrewByEmail(string email)
    {
        try
        {
            var crew = await _context.Crews.FirstOrDefaultAsync(x => x.Email == email);
            return crew;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Crew> GetCrewByIdWithAllIncludedProperties(int crewId)
    {
        try
        {
            var crew = await _context.Crews
                            .Include(cd => cd.CrewDesignations)
                                .ThenInclude(fr => fr.FilmRole)
                            .Include(mcr => mcr.MovieCrewRoles)
                                .ThenInclude(m => m.Movie)
                            .FirstOrDefaultAsync(c => c.Id == crewId);
                            
            crew.MovieCrewRoles = crew.MovieCrewRoles.GroupBy(mcr => mcr.MovieId).Select(g => g.First()).ToList();

            return crew;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    // public async Task<Crew> GetCrewByIdWithAllIncludedProperties(int crewId)
    // {
    //     try
    //     {
    //         var crew = await _context.Crews
    //                         .AsNoTracking()
    //                         .Include(cd => cd.CrewDesignations)
    //                             .ThenInclude(fr => fr.FilmRole)
    //                         .FirstOrDefaultAsync(c => c.Id == crewId);

    //         if (crew != null)
    //         {
    //             var crewMovies = await _context.MovieCrewRoles
    //                                     .Where(mcr => mcr.CrewId == crewId)
    //                                     .Include(mcr => mcr.Movie)
    //                                     .Select(mcr => mcr.Movie)
    //                                     .Distinct()
    //                                     .ToListAsync();

    //             crew.MovieCrewRoles = crewMovies.Select(movie => new MovieCrewRole { Movie = movie }).ToList();
    //         }

    //         return crew;
    //     }
    //     catch (Exception ex)
    //     {
    //         return null;
    //     }
    // }
}



