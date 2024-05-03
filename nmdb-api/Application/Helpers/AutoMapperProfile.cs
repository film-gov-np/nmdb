using Application.CQRS.FilmRoles.Commands.CreateFilmRole;
using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Film;
using Application.Dtos.Theatre;
using AutoMapper;
using Core.Entities;

namespace Neptics.Application.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<FilmRole, CreateFilmRoleCommand>().ReverseMap();
            CreateMap<FilmRoleCategory, FilmRoleCategoryDto>().ReverseMap();
            CreateMap<FilmRole, FilmRoleResponse>().ReverseMap();
            CreateMap<FilmRole, FilmRoleRequest>().ReverseMap();
            
            // Theatre
            CreateMap<Theatre, TheatreRequestDto>().ReverseMap();
            CreateMap<Theatre, TheatreResponseDto>().ReverseMap();

        }
    }
}
