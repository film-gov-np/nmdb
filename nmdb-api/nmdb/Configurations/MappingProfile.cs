using Application.CQRS.FilmRoles.Commands.CreateFilmRole;
using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Auth;
using Application.Dtos.User;
using AutoMapper;
using Core.Entities;
using Infrastructure.Identity;

namespace nmdb.Configurations
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //CreateMap<CreateFilmRoleRequest, CreateFilmRoleCommand>().ReverseMap();
            CreateMap<ApplicationUser, AuthenticateResponse>();
            CreateMap<RegisterRequest, ApplicationUser>();
            CreateMap<CreateRequest, ApplicationUser>();
            
            CreateMap<UserRequestDto, ApplicationUser>().ReverseMap(); ;            
            CreateMap<UserResponseDto, ApplicationUser>().ReverseMap();
            CreateMap<Application.Models.UpdateUserDTO, ApplicationUser>()

                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        // ignore null & empty string properties
                        if (prop == null) return false;
                        if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;
                        return true;
                    }
                ));
            CreateMap<FilmRole, FilmRoleResponseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.RoleCategory.CategoryName));
        }
    }
}
