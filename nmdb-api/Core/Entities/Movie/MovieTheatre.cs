using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class MovieTheatre : BaseEntity<int>
    {
        public int MovieId { get; set; }
        public Movie Movie { get; set; }

        public int TheatreId { get; set; }
        public Theatre Theatre { get; set; }

        public DateTime ShowingDate { get; set; }
    }
}
