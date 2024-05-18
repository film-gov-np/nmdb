using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Constants
{
    public enum eMovieStatus
    {
        [Display(Name = "Released")]
        Released = 1,

        [Display(Name = "Un-Released")]
        Unreleased,

        [Display(Name = "Post-Production")]
        PostProduction,

        [Display(Name = "Censored")]
        Censored,
        
        [Display(Name = "Unknown")]
        Unknown,

        [Display(Name = "Coming Soon")]
        ComingSoon
    }
}
