using Application.CQRS.FilmRoles.Commands.CreateFilmRole;
using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Film;
using Application.Dtos.Theatre;
using Application.Dtos.ProductionHouse;
using AutoMapper;
using Core.Entities;
using Application.Dtos.Movie;
using Application.Dtos;

namespace Neptics.Application.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Film Role
            CreateMap<FilmRole, CreateFilmRoleCommand>().ReverseMap();
            CreateMap<FilmRoleCategory, FilmRoleCategoryDto>().ReverseMap();
            CreateMap<FilmRole, FilmRoleResponse>().ReverseMap();
            CreateMap<FilmRole, FilmRoleRequest>().ReverseMap();

            // Theatre
            CreateMap<Theatre, TheatreRequestDto>().ReverseMap();
            CreateMap<Theatre, TheatreResponseDto>().ReverseMap();

            // ProductionHouse
            CreateMap<ProductionHouse, ProductionHouseRequestDto>().ReverseMap();
            CreateMap<ProductionHouse, ProductionHouseResponseDto>().ReverseMap();

            // Movie
            CreateMap<Movie, MovieRequestDto>().ReverseMap();
            CreateMap<Movie, MovieResponseDto>().ReverseMap();
            CreateMap<MovieCrewRole, MovieCrewRoleDto>().ReverseMap();

            CreateMap<Theatre, MovieTheatreDto>()
                        .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                        .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address));

            CreateMap<MovieTheatre, MovieTheatreDto>()
                        .ForMember(dest => dest.TheatreId, opt => opt.MapFrom(src => src.TheatreId))
                        .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Theatre.Name))
                        .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Theatre.Address))
                        .ForMember(dest => dest.ShowingDate, opt => opt.MapFrom(src => src.ShowingDate));

            CreateMap<MovieProductionHouse, MovieProductionHouseDto>().ReverseMap();
            //CreateMap<List<MovieCrewRole>, List<MovieCrewRoleDto>>().ReverseMap();
            //CreateMap<List<MovieTheatre>, List<MovieTheatreDto>>().ReverseMap();
            //CreateMap<List<MovieProductionHouse>, List<MovieProductionHouseDto>>().ReverseMap();
            CreateMap<MovieCensor, MovieCensorDto>().ReverseMap();

            // Crew
            CreateMap<Crew, CrewRequestDto>().ReverseMap();
            CreateMap<Crew, CrewResponseDto>().ReverseMap();

            CreateMap<Language, LanguageListResponseDto>().ReverseMap();
            CreateMap<Genre, GenresListResponseDto>().ReverseMap();

        }
    }
}
