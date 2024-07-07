using Application.Dtos;
using Application.Dtos.FilterParameters;
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
    [Authorize]
    [RequiredRoles(AuthorizationConstants.AdminRole)]
    [Route("api/crews")]
    public class CrewController : AuthorizedController
    {
        private readonly ILogger<CrewController> _logger;
        private readonly ICrewService _crewService;

        public CrewController(ILogger<CrewController> logger, ICrewService crewService)
        {
            _logger = logger;
            _crewService = crewService;
        }

        // CORS
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CrewFilterParameters filterParameters)
        {
            try
            {
                string currentUserEmail = GetUserEmail;
                filterParameters.SortColumn = "Name";
                var response = await _crewService.GetAllAsync(filterParameters);
                return Ok(response);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpGet("{id}")]
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

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CrewRequestDto model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid crew data.", HttpStatusCode.BadRequest));
                }

                model.Authorship = GetUserEmail;
                var result = await _crewService.CreateCrewAsync(model);

                if (result.IsSuccess)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CrewRequestDto crewRequestDto)
        {
            if (crewRequestDto == null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid crew data provided.", HttpStatusCode.BadRequest));
            }
            crewRequestDto.Authorship = GetUserEmail;
            var result = await _crewService.UpdateCrewAsync(id, crewRequestDto);

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
            var result = await _crewService.DeleteCrewAsync(id);

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
