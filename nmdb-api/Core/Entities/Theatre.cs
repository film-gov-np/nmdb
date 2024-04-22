using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Theatre : BaseEntity<int>
    {
        public string Name { get; set; }
        public string? NepaliName { get; set; }
        public string Address { get; set; }
        public string ContactPerson { get; set; }
        [MaxLength(20)]
        public string ContactNumber { get; set; }
        public int? SeatCapacity { get; set; }
        public string? Email { get; set; }
        public int? NumberOfScreen { get; set; }
        public int? TypeCategory { get; set; }
        public DateTime? EstablishedDate { get; set; }
        public string? Remarks { get; set; }
        public int? DisplayOrder { get; set; }
        public string? WebsiteAddress { get; set; }
        public bool IsActive { get; set; }
    }
}
