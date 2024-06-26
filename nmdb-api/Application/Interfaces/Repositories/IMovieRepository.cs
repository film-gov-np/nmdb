﻿using Core.Entities;

namespace Application.Interfaces.Repositories;

public interface IMovieRepository:IEfRepository<Movie>
{
    Task<Movie> GetMovieWithCrewDetails(int movieId);
    Task<List<Language>> GetAllLanguages();
    Task<List<Genre>> GetAllGenres();
}
