﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Awards
{
    public class AwardsListDto : BaseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NepaliName { get; set; }
        public bool IsVerified { get; set; }
        public string? ProfilePhoto { get; set; }
        public string FatherName { get; set; }
        public string NickName { get; set; }
    }
}