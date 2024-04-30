using Core.Entities;
using Swashbuckle.AspNetCore.Annotations;

namespace Application.Dtos.FilterParameters;

public class FilmRoleFilterParameters : BaseFilterParameters
{
    [SwaggerParameter("Comma-separated list of Category IDs")]
    public string? CategoryIds { get; set; }    
}
