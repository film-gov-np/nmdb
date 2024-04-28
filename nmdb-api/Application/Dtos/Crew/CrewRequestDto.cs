using Core.Constants;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Application.Dtos;

public class CrewRequestDto: CrewDto
{
    public IEnumerable<int> Designations { get; set; }
    public  IFormFile? ProfilePhoto { get; set; }
    //public List<int> MyProperty { get; set; }
}