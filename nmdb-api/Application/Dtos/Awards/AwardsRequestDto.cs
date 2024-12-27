using Application.Dtos.Crew;
using Core.Constants;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class AwardsRequestDto : AwardsDto
{
    public int? MovieID { get; set; }
    public int? CrewID { get; set; }
}
    

