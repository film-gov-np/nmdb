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

            #region Movie Theatre Mapping
            // Movie Theatre
            //CreateMap<TheatreDetailsDto, MovieTheatre>()
            //    .ForMember(dest => dest.TheatreId, opt => opt.MapFrom(src => src.TheatreId))
            //    .ForMember(dest => dest.Theatre, opt => opt.MapFrom(src => new Theatre
            //    {
            //        Id = src.TheatreId,
            //        Name = src.Name,
            //        Address = src.Address
            //    }))
            //    .ReverseMap()
            //    .ForPath(src => src.TheatreId, opt => opt.MapFrom(dest => dest.TheatreId))
            //    .ForPath(src => src.Name, opt => opt.MapFrom(dest => dest.Theatre.Name))
            //    .ForPath(src => src.Address, opt => opt.MapFrom(dest => dest.Theatre.Address));

            //CreateMap<MovieTheatreDto, ICollection<MovieTheatre>>()
            //    .ConvertUsing((src, dest, context) =>
            //    {
            //        var movieTheatres = new List<MovieTheatre>();
            //        foreach (var detail in src.MovieTheatreDetails)
            //        {
            //            var movieTheatre = context.Mapper.Map<MovieTheatre>(detail);
            //            movieTheatre.ShowingDate = src.ShowingDate;
            //            movieTheatres.Add(movieTheatre);
            //        }
            //        return movieTheatres;
            //    });

            //CreateMap<ICollection<MovieTheatre>, MovieTheatreDto>()
            //    .ConvertUsing((src, dest, context) =>
            //    {
            //        var movieTheatreDetails = new List<TheatreDetailsDto>();
            //        foreach (var movieTheatre in src)
            //        {
            //            var detailDto = context.Mapper.Map<TheatreDetailsDto>(movieTheatre.Theatre);
            //            detailDto.TheatreId = movieTheatre.TheatreId;
            //            movieTheatreDetails.Add(detailDto);
            //        }
            //        return new MovieTheatreDto
            //        {
            //            ShowingDate = src.FirstOrDefault()?.ShowingDate ?? default(DateTime),
            //            MovieTheatreDetails = movieTheatreDetails
            //        };
            //    });
            #endregion
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
