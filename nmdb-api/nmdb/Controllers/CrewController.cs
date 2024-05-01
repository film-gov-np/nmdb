using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;
using System.Net;

namespace nmdb.Controllers
{
    [ApiController]
    [Route("api/crews")]
    public class CrewController : AuthorizedController
    {
        private readonly ILogger<CrewController> _logger;
        private readonly ICrewService _crewService;

        public CrewController(ILogger<CrewController> logger,  ICrewService crewService)
        {
            _logger = logger;
            _crewService = crewService;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _crewService.GetCrewByIdAsync(id);

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
    }
}
