using Application.Interfaces.Repositories;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MovieRepository : EfRepository<Movie>, IMovieRepository
{
    private readonly AppDbContext _context;
    public MovieRepository(AppDbContext dbContext) : base(dbContext)
    {
        _context = dbContext;
    }

    public async Task<Movie> GetMovieWithCrewDetails(int movieId)
    {
        var movie = await _context.Movies
                    .Include(m => m.MovieCrewRoles)
                        .ThenInclude(mcr => mcr.Crew)
                    .Include(m => m.MovieLanguages)                        
                    .Include(m => m.MovieGenres)
                    .Include(m => m.MovieTheatres)
                        .ThenInclude(mt => mt.Theatre)
                    .Include(m => m.MovieProductionHouses)
                    .Include(m => m.Censor)

                    .FirstOrDefaultAsync(m => m.Id == movieId);
        return movie;
    }
}
