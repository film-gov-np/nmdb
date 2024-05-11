using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class ProductionHouse : BaseEntity<int>
    {
        public string Name { get; set; }
        public string? NepaliName { get; set; }
        public string? Address { get; set; }
        public string? ContactPerson { get; set; }
        [MaxLength(20)]
        public string? ContactNumber { get; set; }
        public DateTime? EstablishedDate { get; set; }
        public bool IsRunning { get; set; } = true;
        public string? ChairmanName{ get; set; }

        public ICollection<MovieProductionHouse> MovieProductionHouses { get; set; } = new List<MovieProductionHouse>();
    }
}
