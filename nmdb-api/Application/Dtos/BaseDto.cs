using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class BaseDto
    {
        [JsonIgnore]
        [BindNever]
        public string? Authorship { get; set; } = "";

    }
}
