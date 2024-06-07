using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Media
{
    public class FileDTO
    {
        public IFormFile Files { get; set; }
        public bool ReadableName { get; set; }
        public bool Thumbnail { get; set; }
        public string? SubFolder { get; set; }
    }
}
