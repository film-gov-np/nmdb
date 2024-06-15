using Application.Dtos.Crew;
using Application.Dtos.Movie;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos;

public class AwardsResponseDto : AwardsDto
{
    public int Id { get; set; }
    public MovieListResponseDto? Movie { get; set; }
    public CrewListDto? Crew { get; set; }

}
