using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.CQRS.FilmRoles.Queries
{
    public sealed record FilmRoleResponseDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public int RoleCategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? DisplayOrder { get; set; }


        public FilmRoleResponseDto(int id, string roleName, int roleCategoryId, string categoryName, int? displayOrder)
        {
            Id = id;
            RoleName = roleName;
            CategoryName = categoryName;
            DisplayOrder = displayOrder;
            RoleCategoryId = roleCategoryId;
        }

        public FilmRoleResponseDto() { }
    }

}
