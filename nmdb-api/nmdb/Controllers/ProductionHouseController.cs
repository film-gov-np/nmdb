using Application.Dtos.Film;
using Application.Dtos.FilterParameters;
using Application.Dtos.ProductionHouse;
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
    [RequiredRoles(AuthorizationConstants.AdminRole, AuthorizationConstants.UserRole)]
    [Route("api/production-house/")]
    public class ProductionHouseController : AuthorizedController
    {
        private readonly ILogger<ProductionHouseController> _logger;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IProductionHouseService _productionHouseService;
        public ProductionHouseController(ILogger<ProductionHouseController> logger, IHttpContextAccessor contextAccessor, IProductionHouseService productionHouseService)
        {
            _logger = logger;
            _contextAccessor = contextAccessor;
            _productionHouseService = productionHouseService;
        }

        public async Task<IActionResult> GetAll([FromQuery] ProductionHouseFilterParameters filterParameters)
        {
            var response = await _productionHouseService.GetAllAsync(filterParameters);
            return Ok(response);
        }
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _productionHouseService.GetByIdAsync(id);

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
        public async Task<IActionResult> Create([FromBody] ProductionHouseRequestDto productionHouseRequestDto)
        {
            if (productionHouseRequestDto == null)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid production house data.", HttpStatusCode.BadRequest));
            }

            productionHouseRequestDto.AuditedBy = GetUserId;
            var result = await _productionHouseService.CreateAsync(productionHouseRequestDto);

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
        public async Task<IActionResult> Update(int id, [FromBody]ProductionHouseRequestDto productionHouseRequestDto)
        {
            productionHouseRequestDto.AuditedBy = GetUserId;
            var result = await _productionHouseService.UpdateAsync(id, productionHouseRequestDto);

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
            var result = await _productionHouseService.DeleteByIdAsync(id);

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
