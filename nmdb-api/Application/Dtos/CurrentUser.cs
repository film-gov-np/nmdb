using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class CurrentUser
    {
        public string? ID { get; set; }
        public string? Roles { get; set; }        
        public string? UserName { get; set; }
    }
}
