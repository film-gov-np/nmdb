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
        try
        {
            var movie = await _context.Movies
                        .Include(m => m.MovieCrewRoles)
                            .ThenInclude(mcr => mcr.Crew)
                        .Include(m => m.MovieCrewRoles)
                            .ThenInclude(mcr => mcr.FilmRole)
                        .Include(m => m.MovieLanguages)
                            .ThenInclude(ml => ml.Language)
                        .Include(m => m.MovieGenres)
                            .ThenInclude(mg => mg.Genre)
                        .Include(m => m.MovieTheatres)
                            .ThenInclude(mt => mt.Theatre)
                        .Include(m => m.MovieProductionHouses)
                            .ThenInclude(mp => mp.ProductionHouse)
                        .Include(m => m.Censor)

                        .FirstOrDefaultAsync(m => m.Id == movieId);
            return movie;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<List<Language>> GetAllLanguages()
    {
        var languages = await _context.Languages.ToListAsync();
        return languages;
    }

    public async Task<List<Genre>> GetAllGenres()
    {
        var genres = await _context.Genres.ToListAsync();
        return genres;
    }
}
