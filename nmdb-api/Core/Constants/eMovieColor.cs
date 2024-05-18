using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Constants
{
    public enum eMovieColor
    {
        [Display(Name = "Black and White")]
        BlackAndWhite = 1,
        [Display(Name = "Eastman Color")]
        EastmanColor,
        [Display(Name = "Kodak Color")]
        KodakColor,
        [Display(Name = "Gewa Color")]
        GewaColor,
        [Display(Name = "Fuji Color")]
        FujiColor,
        [Display(Name = "Agfa Color")]
        AgfaColor,
        [Display(Name = "None")]
        None,
    }
}
