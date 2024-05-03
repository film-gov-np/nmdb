using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Dtos.Theatre;
using Application.Interfaces.Services;
using Core;
using Core.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using nmdb.Filters;
using System.Net;

namespace nmdb.Controllers
{
    [ApiController]
    [CustomAuthorize(AuthorizationConstants.AdminRole, AuthorizationConstants.UserRole)]
    [Route("api/theatres/")]
    public class TheatreController : AuthorizedController
    {
        private readonly ILogger<TheatreController> _logger;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ITheatreService _theatreService;
        public TheatreController(ILogger<TheatreController> logger, IHttpContextAccessor contextAccessor, ITheatreService theatreService)
        {
            _logger = logger;
            _contextAccessor = contextAccessor;
            _theatreService = theatreService;
        }

        public async Task<IActionResult> GetAll([FromQuery] TheatreFilterParameters filterParameters)
        {
            var response = await _theatreService.GetAllAsync(filterParameters);
            return Ok(response);
        }
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _theatreService.GetByIdAsync(id);

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
        public async Task<IActionResult> Create([FromBody] TheatreRequestDto theatreRequestDto)
        {
            if (theatreRequestDto == null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid theatre data.", HttpStatusCode.BadRequest));
            }

            var result = await _theatreService.CreateAsync(theatreRequestDto);

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
        public async Task<IActionResult> Update(int id, [FromBody] TheatreRequestDto theatreRequestDto)
        {
            var result = await _theatreService.UpdateAsync(id, theatreRequestDto);

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
            var result = await _theatreService.DeleteByIdAsync(id);

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
