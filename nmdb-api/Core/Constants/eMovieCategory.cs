using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Core.Constants;

public enum eMovieCategory
{
    [Display(Name="Movie")]
    Movie = 1,

    [Display(Name = "Documentary")]
    Documentary,

    [Display(Name = "TV-Show")]
    TvShow,

    [Display(Name ="None")]
    None
}
