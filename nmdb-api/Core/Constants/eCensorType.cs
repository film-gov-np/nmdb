using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Core.Constants;

public enum eCensorType
{
    [Display(Name = "Parental Guidance")]
    PG = 1,

    [Display(Name = "Unrestricted Public Exhibition")]
    UA,

    [Display(Name = "Adult")]
    A,

    [Display(Name = "Restricted")]
    R,
}
