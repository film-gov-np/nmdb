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
        public string Authorship { get; set; } = "";

    }
}
