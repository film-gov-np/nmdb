using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nmdb.Common;

namespace nmdb.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/production-house")]
    public class ProductionHouseController : AuthorizedController
    {
        private readonly ILogger<ProductionHouseController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProductionHouseService _productHouseService;
        public ProductionHouseController(ILogger<ProductionHouseController> logger, IHttpContextAccessor httpContextAccessor, IProductionHouseService productHouseService)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _productHouseService = productHouseService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductionHouse([FromBody] ProductionHouse productionHouse)
        {
            return Ok();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProductionHouse()
        {
            return Ok();
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductionHouse(int id)
        {
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductionHouse(int id)
        {
            return Ok();

        }
    }
}