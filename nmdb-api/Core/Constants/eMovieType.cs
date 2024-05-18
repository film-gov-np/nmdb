using System.ComponentModel.DataAnnotations;

namespace Core.Constants;

public enum eMovieType
{
    [Display(Name ="Celluloid")]
    Celluloid = 1,

    [Display(Name = "Digital")]
    Digital,

    [Display(Name = "Video")]
    Video
}
