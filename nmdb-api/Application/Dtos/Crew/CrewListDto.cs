using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Crew
{
    public class CrewListDto : BaseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NepaliName { get; set; }
        public bool IsVerified { get; set; }
        public string? ProfilePhotoUrl { get; set; }
        public string Email { get; set; }
        public string NickName { get; set; }
    }
}
