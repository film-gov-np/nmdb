using Application.Dtos.Crew;
using Core.Constants;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos;

public class AwardsDto : BaseDto
{
    public string AwardTitle { get; set; }
    public string CategoryName { get; set; }
    public string? AwardedIn { get; set; }
    public string? AwardStatus { get; set; }
    public DateTime? AwardedDate { get; set; }
    public string? Remarks { get; set; }

}
