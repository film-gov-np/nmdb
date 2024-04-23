using Core.Entities;

namespace Application.Dtos.FilterParameters;

public class FilmRoleFilterParameters : BaseFilterParameters
{
    public int? CategoryId { get; set; }    
}
