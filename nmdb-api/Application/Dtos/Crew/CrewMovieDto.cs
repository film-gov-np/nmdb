﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Crew
{
    public class CrewMovieDto
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? NepaliName { get; set; }
        public string? ReleaseDateBS { get; set; }
        public string? ThumbnailImagePath { get; set; }
    }
}
