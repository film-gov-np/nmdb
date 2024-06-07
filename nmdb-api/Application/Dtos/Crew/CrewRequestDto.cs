using Core.Constants;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
namespace Application.Dtos;

public class CrewRequestDto: CrewDto
{
    public IEnumerable<DesignationDto> Designations { get; set; }
    public IFormFile? ProfilePhotoFile { get; set; }
}

public class DesignationDto
{    
    public int Id { get; set; }    
    public string RoleName { get; set; }
}