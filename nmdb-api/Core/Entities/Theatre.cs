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
        [MaxLength(255)]
        public string Name { get; set; }
        [MaxLength(255)]
        public string? NepaliName { get; set; }
        public int? SeatCapacity { get; set; }
        public int? NumberOfScreen { get; set; }
        [MaxLength(100)]
        public string Address { get; set; }
        [MaxLength(50)]
        public string ContactPerson { get; set; }
        [MaxLength(50)]
        public string ContactNumber { get; set; }
        [MaxLength(50)]
        public string? Email { get; set; }
        [MaxLength(50)]
        public string? EstablishedDate { get; set; }
        [MaxLength(255)]
        public string? WebsiteUrl { get; set; }
        public string? Remarks { get; set; }
        public bool IsRunning { get; set; } = true;

        public ICollection<MovieTheatre> MovieTheatres { get; set; } = new List<MovieTheatre>();
    }
}
