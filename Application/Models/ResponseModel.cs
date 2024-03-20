using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models
{
    public class ResponseModel<T>
    {
        public bool Status { get; set; } = true;    
        public int TotalRows { get; set; }
        public T Entity { get; set; }
        public List<string> Message { get; set; } = new List<string>();
    }
}
