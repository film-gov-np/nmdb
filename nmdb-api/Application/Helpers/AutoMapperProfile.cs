using Application.CQRS.FilmRoles.Commands.CreateFilmRole;
using Application.Dtos.Film;
using AutoMapper;
using Core.Entities;

namespace Neptics.Application.Helpers
{
    public class AutoMapperProfile:Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<FilmRole, CreateFilmRoleCommand>().ReverseMap();
            CreateMap<FilmRoleCategory, FilmRoleCategoryDto>().ReverseMap();
            //CreateMap<UserProfile,UserDTO>().ReverseMap();
            //CreateMap<User, UserDTO>().ReverseMap();
            //CreateMap<User, LoggedInUser>().ReverseMap();
            //CreateMap<UserProfile, UserListItem>().ReverseMap();

        }
    }
}
