﻿using Application.Dtos;
using Application.Dtos.Crew;
using Application.Dtos.FilterParameters;
using Application.Helpers.Response;
using Core;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services;

public interface ICrewService
{
    Task<ApiResponse<PaginationResponse<CrewListDto>>> GetAllAsync(CrewFilterParameters filterParameters);
    Task<ApiResponse<string>> CreateCrewAsync(CrewRequestDto crewRequestDto);
    Task<ApiResponse<string>> UpdateCrewAsync(int crewId, CrewRequestDto crewRequestDto);
    Task<ApiResponse<CrewResponseDto>> GetCrewByIdAsync(int crewId);
    Task<ApiResponse<CrewResponseDto>> GetCrewByEmailAsync(string email);
    Task<ApiResponse<string>> DeleteCrewAsync(int crewId);
}
