using Application.BaseManager;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace nmdb.Controllers;

[ApiController]
[Route("api/front/")]
public class FrontController:ControllerBase
{
    private readonly IMovieService _movieService;
    private readonly ICrewService _crewService;
    public FrontController(IMovieService movieService, ICrewService crewService)
    {
        _crewService = crewService;
        _movieService = movieService;
    }

    // Write APIs to fetch
    // -- Trending Movies
    // -- Featured Movies
    // -- Crews/Artists
    // -- Cinema Halls/Theatres
    // Each with appropriate filters
    // Application Forms(Later)

}
