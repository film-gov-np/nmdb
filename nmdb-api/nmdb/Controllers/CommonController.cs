using Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace nmdb.Controllers
{
    [ApiController]
    [Route("api/common/")]
    public class CommonController : ControllerBase
    {
        private readonly ICommonService _commonService;

        public CommonController(ICommonService commonService)
        {
            _commonService = commonService;
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

    }
}
