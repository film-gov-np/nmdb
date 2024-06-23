using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.FilterParameters
{
    public class CrewFilterParameters : BaseFilterParameters
    {
        public bool? IsFeatured { get; set; }
        public bool? IsVerified { get; set; }
    }
}
