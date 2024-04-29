using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Film
{
public record FilmRoleDto(int? Id, string RoleName,int RoleCategoryId, int? DisplayOrder);
}
