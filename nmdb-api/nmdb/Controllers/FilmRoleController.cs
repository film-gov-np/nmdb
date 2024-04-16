using Application.Interfaces;
using Core.Entities;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace nmdb.Controllers
{
    [ApiController]
    //[TypeFilter(typeof(AuthorizeAccount))]
    [Route("[controller]")]
    public class FilmRoleController : ControllerBase
    {
        private readonly ILogger<FilmRoleController> _logger;

        public FilmRoleController(ILogger<FilmRoleController> logger)
        {
            _logger = logger;
        }

        [HttpGet("GetFilmRoles")]
        public async Task<object> GetFilmRoles(IUnitOfWork unitOfWork, int pageNo = 1, int pageSize = 10)
        {
            var res = await unitOfWork.FilmRoleRepository.Get()
                                                         .Include(g => g.RoleCategory)
                                                         .OrderBy(fr => fr.RoleName)
                                                         .Skip((pageNo - 1) * pageSize)
                                                         .Take(pageSize)
                                                         .ToListAsync();
            return new
            {
                FilmRoles = res.Select(fr => new
                {
                    fr.Id,
                    fr.RoleName,
                    fr.RoleCategory?.CategoryName,
                    fr.RoleCategoryId,
                    fr.CreatedAt,
                    fr.CreatedBy
                }).ToList()
            };
        }

        [HttpPost("AddFilmRoles")]
        public async Task<object> AddFilmRoles(IUnitOfWork unitOfWork)
        {
            try
            {
                await unitOfWork.BeginTransactionAsync();
                FilmRole filmRole = new()
                {
                    RoleName = "another test role",
                    RoleCategoryId = 1,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "test"
                };
                await unitOfWork.FilmRoleRepository.AddAsync(filmRole);
                await unitOfWork.CommitAsync();
                return new { Success = true };
            }
            catch (Exception ex)
            {
                unitOfWork.Rollback();
                return new { Success = false };

            }
        }
    }
}
