using Application.Dtos;
using Core;
using Core.Entities;
namespace Application.Interfaces.Repositories;

public interface ICrewRepository : IEfRepository<Crew>
{
    Task<Crew> GetCrewByEmail(string email);
    Task<Crew> GetCrewByIdWithAllIncludedProperties(int crewId);
}
