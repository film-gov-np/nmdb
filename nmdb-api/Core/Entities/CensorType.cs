using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class CensorType
    {
        [Key]
        public int Id { get; set; }
        public string Certificate { get; set; }
        public string? Remarks { get; set; }

        public CensorType() { }
    }
}
