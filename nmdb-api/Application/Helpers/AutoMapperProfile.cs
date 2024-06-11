using Application.CQRS.FilmRoles.Commands.CreateFilmRole;
using Application.CQRS.FilmRoles.Queries;
using Application.Dtos.Film;
using Application.Dtos.Theatre;
using Application.Dtos.ProductionHouse;
using AutoMapper;
using Core.Entities;
using Application.Dtos.Movie;
using Application.Dtos;
using Core.Entities.Awards;
using Application.Dtos.Crew;

namespace Neptics.Application.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Film Role
            CreateMap<FilmRole, CreateFilmRoleCommand>().ReverseMap();
            CreateMap<FilmRoleCategory, FilmRoleCategoryDto>().ReverseMap();
            CreateMap<FilmRole, FilmRoleResponseDto>().ReverseMap();
            CreateMap<FilmRole, FilmRoleRequest>().ReverseMap();
            CreateMap<FilmRole, FilmRoleBasicDto>();

            // Theatre
            CreateMap<Theatre, TheatreRequestDto>().ReverseMap();
            CreateMap<Theatre, TheatreResponseDto>().ReverseMap();

            // ProductionHouse
            CreateMap<ProductionHouse, ProductionHouseRequestDto>().ReverseMap();
            CreateMap<ProductionHouse, ProductionHouseResponseDto>().ReverseMap();

            CreateMap<Genre, GenreDto>().ReverseMap();
            CreateMap<Language, LanguageDto>().ReverseMap();

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

            #region Crew
            CreateMap<Crew, CrewRequestDto>().ReverseMap();
            CreateMap<Crew, CrewResponseDto>()
                        .ForMember(dest => dest.Designations, opt => opt.MapFrom(src => src.CrewDesignations.Select(cd => new CrewDesignationDto
                        {
                            Id = cd.FilmRole.Id,
                            RoleName = cd.FilmRole.RoleName
                        }).Distinct()
                        ))
            .ForMember(dest => dest.Movies, opt => opt.MapFrom(src => src.MovieCrewRoles.Select(mcr => new CrewMovieDto
            {
                Id = mcr.Movie.Id,
                Name = mcr.Movie.Name,
                NepaliName = mcr.Movie.NepaliName,
                ReleaseDateBS = mcr.Movie.ReleaseDateBS,
                ThumbnailImagePath = mcr.Movie.ThumbnailImage
            }).Distinct()
            ));

            CreateMap<CrewDesignation, CrewDesignationDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.FilmRole.Id))
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.FilmRole.RoleName));

            CreateMap<MovieCrewRole, CrewMovieDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Movie.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Movie.Name));

            CreateMap<Language, LanguageListResponseDto>().ReverseMap();
            CreateMap<Genre, GenresListResponseDto>().ReverseMap();
            #endregion

            // Awards
            CreateMap<Awards, AwardsRequestDto>().ReverseMap();
            CreateMap<Awards, AwardsResponseDto>().ReverseMap();
        }
    }
}
