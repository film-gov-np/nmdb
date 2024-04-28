using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Crew
{
    public class CrewDesignationDto
    {
        public int Id { get; set; }
        public int CrewId { get; set; }
        public List<int> RoleIds { get; set; }
    }
}
