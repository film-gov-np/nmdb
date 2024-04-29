using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Dtos.Film;


public class FilmRoleRequest
{
    [JsonIgnore]
    public int? Id { get; set; }
    [Required(ErrorMessage ="Role name is required.")]
    public string RoleName { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Role category must be provided.")]
    public int RoleCategoryId { get; set; }

    public FilmRoleRequest(string roleName, int roleCategoryId)
    {
        RoleName = roleName;
        RoleCategoryId = roleCategoryId;
    }
}