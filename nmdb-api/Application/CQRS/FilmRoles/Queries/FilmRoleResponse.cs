using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.CQRS.FilmRoles.Queries
{
    public sealed record FilmRoleResponse
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string CategoryName { get; set; }
        public int? DisplayOrder { get; set; }


        public FilmRoleResponse(int id, string roleName, string categoryName, int? displayOrder)
        {
            Id = id;
            RoleName = roleName;
            CategoryName = categoryName;
            DisplayOrder = displayOrder;
        }

        public FilmRoleResponse() { }
    }

}
