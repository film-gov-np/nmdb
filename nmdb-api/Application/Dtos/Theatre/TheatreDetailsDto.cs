using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Application.Dtos.Theatre;

public class TheatreDetailsDto
{
    
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Address { get; set; }
}
