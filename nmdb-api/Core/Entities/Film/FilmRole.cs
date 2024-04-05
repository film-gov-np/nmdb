using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class FilmRole : BaseEntity<int>
    {
        public FilmRoleCategory RoleCategory { get; set; }
        public string RoleName { get; set; }
        public int DisplayOrder { get; set; }

    }
}
