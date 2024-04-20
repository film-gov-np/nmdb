using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.CQRS.FilmRoles.Queries
{
    public sealed record FilmRoleResponse(int Id, string RoleName, string CategoryName, int? DisplayOrder);

}
