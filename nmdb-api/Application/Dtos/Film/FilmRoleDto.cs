using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Dtos.Film;


public class FilmRoleDto
{
    [JsonIgnore]
    public int? Id { get; set; }
    public string RoleName { get; set; }
    public int RoleCategoryId { get; set; }

    public FilmRoleDto(string roleName, int roleCategoryId)
    {
        RoleName = roleName;
        RoleCategoryId = roleCategoryId;
    }
}