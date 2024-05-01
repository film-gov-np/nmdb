using Application.Dtos;
using Application.Dtos.Crew;
using Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services;

public interface ICrewService
{
    Task<ApiResponse<string>> CreateCrewAsync(CrewRequestDto crewRequestDto);
    Task<PaginationResponseOld<CrewListDto>> GetCrewsAsync();
    Task<ApiResponse<CrewResponseDto>> GetCrewByIdAsync(int crewId);
    Task<ApiResponse<string>> UpdateCrewAsync(CrewRequestDto crewRequestDto);
    Task<ApiResponse<string>> DeleteCrewAsync(int crewId);
}
