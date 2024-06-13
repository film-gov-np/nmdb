using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.User
{
    public class UserRequestDto : UserBasicDto
    {        

        public string Password { get; set; }
        public IFormFile? ProfilePhotoFile { get; set; }
        public UserRequestDto(string id, string firstName, string lastName, string role, string email, string password)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Role = role;
            Email = email;
            Password = password;
        }
    }    
}
