using Application.CQRS.FilmRoles.Commands.CreateFilmRole;
using Application.Dtos.Auth;
using AutoMapper;
using Infrastructure.Identity;
using nmdb.Endpoints.Films.FilmRole;

namespace nmdb.Configurations
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateFilmRoleRequest, CreateFilmRoleCommand>().ReverseMap();            
            CreateMap<ApplicationUser, AuthenticateResponse>();

            CreateMap<RegisterRequest, ApplicationUser>();

            CreateMap<CreateRequest, ApplicationUser>();

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

        }
    }
}
