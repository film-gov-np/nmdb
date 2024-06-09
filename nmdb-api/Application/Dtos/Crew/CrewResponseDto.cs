using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos;

public class CrewResponseDto : CrewRequestDto
{
    public int Id { get; set; }
    public string? ProfilePhotoUrl { get; set; }
}
