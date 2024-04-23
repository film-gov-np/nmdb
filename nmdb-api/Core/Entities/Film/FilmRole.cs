using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class FilmRole : BaseEntity<int>
    {
        public int RoleCategoryId { get; set; }

        [ForeignKey(nameof(RoleCategoryId))]
        // virtual enables lazy loading i.e related entities are automatically loaded from the db when
        // accessed for the first time
        public FilmRoleCategory RoleCategory { get; set; }
        public string RoleName { get; set; }
        public int? DisplayOrder { get; set; }

        public ICollection<CrewRole> CrewRoles { get; set; } = new List<CrewRole>();
        public ICollection<MovieCrewRole> MovieCrewRoles { get; set; } = new List<MovieCrewRole>();

    }
}
