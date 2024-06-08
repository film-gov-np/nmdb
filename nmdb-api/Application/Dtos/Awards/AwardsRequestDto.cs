using Application.Dtos.Crew;
using Core.Constants;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class AwardsRequestDto: AwardsDto
{
    public IEnumerable<AwardsDto>? Designations { get; set; }
    public IEnumerable<CrewMovieDto>? Movies { get; set; }
    public IFormFile? ProfilePhotoFile { get; set; }
}

