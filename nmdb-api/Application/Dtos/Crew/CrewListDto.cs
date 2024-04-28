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
        public string FatherName { get; set; }
        public string MotherName { get; set; }
        public string NickName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }

        public CrewListDto(int id, string name, string nickName, string fathersName, string mothersName)
        {
            Id = id;
            Name = name;
            NickName=  nickName;
            FatherName = fathersName;
            MotherName = mothersName;
        }
    }
}
