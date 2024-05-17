using Application.Dtos.FilterParameters;
using Application.Dtos.Theatre;
using Application.Interfaces.Services;
using Core.Constants;
using Core;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Application.Dtos.Movie;

namespace nmdb.Controllers
{
    [ApiController]
    [Authorize]
    [RequiredRoles(AuthorizationConstants.AdminRole, AuthorizationConstants.UserRole)]
    [Route("api/movies/")]
    public class MovieController : AuthorizedController
    {
        private readonly ILogger<MovieController> _logger;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IMovieService _movieService;
        public MovieController(ILogger<MovieController> logger, IHttpContextAccessor contextAccessor, IMovieService movieService)
        {
            _logger = logger;
            _contextAccessor = contextAccessor;
            _movieService = movieService;
        }

        [HttpGet("GetAllLanguages")]
        public async Task<IActionResult> GetAllLanguages()
        {
            try
            {
                var response = await _movieService.GetAllLanguages();
                return Ok(response);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet("GetAllGenres")]
        public async Task<IActionResult> GetAllGenres()
        {
            try
            {
                var response = await _movieService.GetAllGenres();
                return Ok(response);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> GetAll([FromQuery] MovieFilterParameters filterParameters)
        {
            var response = await _movieService.GetAllAsync(filterParameters);
            return Ok(response);
        }
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _movieService.GetByIdAsync(id);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] MovieRequestDto movieRequestDto)
        {
            if (movieRequestDto == null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid movie data.", HttpStatusCode.BadRequest));
            }

            movieRequestDto.AuditedBy = GetUserId;
            var result = await _movieService.CreateAsync(movieRequestDto);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] MovieRequestDto movieRequestDto)
        {
            movieRequestDto.AuditedBy = GetUserId;
            var result = await _movieService.UpdateAsync(id, movieRequestDto);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _movieService.DeleteByIdAsync(id);

            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else if (result.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound(result);
            }
            else
                return BadRequest(result);

        }
    }
}
