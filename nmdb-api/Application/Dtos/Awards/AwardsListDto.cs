using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Awards
{
    public class AwardsListDto : BaseDto
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string AwardTitle { get; set; }
        public string AwardedIn { get; set; }
        public string AwardStatus { get; set; }
        public DateTime? AwardedDate { get; set; }
        public string Remarks { get; set; }
        public int? CrewID { get; set; }
        public int? MovieID { get; set; }
    }
}
