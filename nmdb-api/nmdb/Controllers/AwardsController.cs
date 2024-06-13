using Application.Dtos;
using Application.Dtos.FilterParameters;
using Application.Dtos.Theatre;
using Application.Interfaces.Services;
using Application.Services;
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
    [RequiredRoles(AuthorizationConstants.AdminRole)]
    [Route("api/awards")]
    public class AwardsController : AuthorizedController
    {
        private readonly ILogger<AwardsController> _logger;
        private readonly IAwardsService _awardsService;

        public AwardsController(ILogger<AwardsController> logger, IAwardsService awardsService)
        {
            _logger = logger;
            _awardsService = awardsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] AwardsFilterParameters filterParameters)
        {
            try
            {
                var response = await _awardsService.GetAllAsync(filterParameters);
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
            var result = await _awardsService.GetAwardsByIdAsync(id);

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
        public async Task<IActionResult> Create([FromBody] AwardsRequestDto model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid awards data.", HttpStatusCode.BadRequest));
                }

                model.Authorship = GetUserEmail;
                var result = await _awardsService.CreateAwardsAsync(model);

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
        public async Task<IActionResult> Update(int id, [FromBody] AwardsRequestDto crewRequestDto)
        {
            if (crewRequestDto == null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid awards data provided.", HttpStatusCode.BadRequest));
            }
            crewRequestDto.Authorship = GetUserEmail;
            var result = await _awardsService.UpdateAwardsAsync(id, crewRequestDto);

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
            string Authorship = GetUserEmail;
            var result = await _awardsService.DeleteAwardsAsync(id, Authorship);

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
