using Application.Dtos.Auth;
using AutoMapper;
using Infrastructure.Identity;

namespace nmdb.Configurations
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
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
