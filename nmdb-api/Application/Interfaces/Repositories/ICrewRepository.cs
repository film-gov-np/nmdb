using Application.Dtos;
using Core;
using Core.Entities;
namespace Application.Interfaces.Repositories;

public interface ICrewRepository : IEfRepository<Crew>
{
    Crew GetCrewByEmail(string email);
}
