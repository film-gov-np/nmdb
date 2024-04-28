using Core.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos;

public class CrewDto : BaseDto
{
    public string Name { get; set; }

    public string NepaliName { get; set; }

    public string BirthName { get; set; }

    public string FatherName { get; set; }

    public string MotherName { get; set; }

    public string NickName { get; set; }

    public eGender Gender { get; set; }

    public DateTime? DateOfBirthInAD { get; set; }

    public string? DateOfBirthInBS { get; set; }

    public DateTime? DateOfDeathInAD { get; set; }

    public string? DateOfDeathInBS { get; set; }

    public string? BirthPlace { get; set; }

    public string? Height { get; set; }

    public string? StarSign { get; set; }

    public string? CurrentAddress { get; set; }

    public string? Biography { get; set; }

    public string? BiographyInNepali { get; set; }

    public string? TradeMark { get; set; }

    public string? Trivia { get; set; }

    public string? Activities { get; set; }

    public string? ProfilePhoto { get; set; }

    public string? ThumbnailPhoto { get; set; }

    public string? OfficialSite { get; set; }

    public string? FacebookID { get; set; }

    public string? TwitterID { get; set; }

    public string ContactNumber { get; set; }

    public string? MobileNumber { get; set; }

    public int? ViewCount { get; set; }

    public bool IsVerified { get; set; }

    public bool IsActive { get; set; }
}
