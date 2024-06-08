using Core.Constants;

namespace Application.Dtos.FilterParameters;

public class MovieFilterParameters : BaseFilterParameters
{
    public eMovieCategory? Category { get; set; } 
    public eMovieStatus? Status { get; set; } 
}
