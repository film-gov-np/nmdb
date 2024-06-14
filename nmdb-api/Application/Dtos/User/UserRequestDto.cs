using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.User
{
    public class UserRequestDto : BaseDto
    {        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string? ProfilePhoto { get; set; }
        public string Password { get; set; }
        public IFormFile? ProfilePhotoFile { get; set; }
    }  
    public class UserUpdateRequestDto: UserBasicDto
    { 
        public IFormFile? ProfilePhotoFile { get; set; }

    }
}
