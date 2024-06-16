using Application.Dtos.FilterParameters;
using Application.Interfaces.Services;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace nmdb.Controllers;

[ApiController]
[Route("api/front/")]
public class FrontController : ControllerBase
{
    private readonly IMovieService _movieService;
    private readonly ICrewService _crewService;
    private readonly ICommonService _commonService;
    private readonly ITheatreService _theatreService;
    public FrontController(IMovieService movieService, ICrewService crewService, ICommonService commonService, ITheatreService theatreService)
    {
        _crewService = crewService;
        _movieService = movieService;
        _commonService = commonService;
        _theatreService = theatreService;
    }

    [HttpGet("movies")]
    public async Task<IActionResult> GetMovies([FromQuery] MovieFilterParameters? filterParameters)
    {
        try
        {
            var movies = await _movieService.GetAllAsync(filterParameters);
            return Ok(movies);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpGet("crews")]
    public async Task<IActionResult> GetCrews([FromQuery] CrewFilterParameters? filterParameters)
    {
        try
        {
            var crews = await _crewService.GetAllAsync(filterParameters);
            return Ok(crews);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpGet("{id}/crew-details")]
    public async Task<IActionResult> GetCrewDetails(int id)
    {
        try
        {
            var crews = await _crewService.GetCrewByIdAsync(id);
            return Ok(crews);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpGet("{id}/movie-details")]
    public async Task<IActionResult> GetMovieDetails(int id)
    {
        try
        {
            var crews = await _movieService.GetByIdAsync(id);
            return Ok(crews);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpGet("global-search")]
    public async Task<IActionResult> GlobalSearch([FromQuery] BaseFilterParameters filterParameters)
    {
        try
        {
            var response = await _commonService.GetGlobalSearchResults(filterParameters);
            if (response.IsSuccess)
                return Ok(response);
            return BadRequest(response);
        }
        catch (Exception ex)
        {

            throw ex;

        }
    }

    [HttpGet("theatres")]
    public async Task<IActionResult> GetTheatres([FromQuery] TheatreFilterParameters? filterParameters)
    {
        try
        {
            var movies = await _theatreService.GetAllAsync(filterParameters);
            return Ok(movies);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }
}

