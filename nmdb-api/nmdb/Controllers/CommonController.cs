using Application.Dtos;
using Application.Interfaces.Services;
using Core;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace nmdb.Controllers
{
    [ApiController]
    [Route("api/common/")]
    public class CommonController : ControllerBase
    {
        private readonly ICommonService _commonService;
        private readonly AppDbContext _appDbContext;

        public CommonController(ICommonService commonService, AppDbContext appDbContext)
        {
            _commonService = commonService;
            _appDbContext = appDbContext;
        }

        [HttpGet("film-roles")]
        public async Task<IActionResult> GetAllFilmRoles()
        {
            try
            {
                var allFilmRoles = await _commonService.GetAllRoles();
                return Ok(allFilmRoles);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("counts")]
        public async Task<IActionResult> GetCounts()
        {
            try
            {
                var movieCount = await _appDbContext.Movies.CountAsync();
                var theatreCount = await _appDbContext.Theatres.CountAsync();
                var crewCount = await _appDbContext.Crews.CountAsync();
                var productionHouseCount = await _appDbContext.ProductionHouses.CountAsync();

                var result = ApiResponse<CountsResponseDto>.SuccessResponse(new CountsResponseDto
                {
                    MovieCount = movieCount,
                    TheatreCount = theatreCount,
                    CrewCount = crewCount,
                    ProductionHouseCount = productionHouseCount
                });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<CountsResponseDto>.ErrorResponse("Something went wrong while fetching counts."));
            }
        }

    }
}
