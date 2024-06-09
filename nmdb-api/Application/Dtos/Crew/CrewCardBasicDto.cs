

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Crew
{
    public class CrewCardBasicDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Email { get; set; }
        public string? CurrentAddress { get; set; }
        public string? ProfilePhotoUrl { get; set; } 
    }
}
