using Application.BaseManager;
using Application.Dtos.FilterParameters;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

namespace nmdb.Controllers;

[ApiController]
[Route("api/front/")]
public class FrontController : ControllerBase
{
    private readonly IMovieService _movieService;
    private readonly ICrewService _crewService;

    public FrontController(IMovieService movieService, ICrewService crewService)
    {
        _crewService = crewService;
        _movieService = movieService;
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
}