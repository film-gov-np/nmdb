using Application.Dtos.Film;
using Application.Interfaces;
using Application.Interfaces.Services;
using AutoMapper;
using Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CommonService : ICommonService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CommonService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<FilmRoleBasicDto>>> GetAllRoles()
        {
            try
            {
                var filmRoles = await _unitOfWork.FilmRoleRepository.GetAllRoles();
                var filmRolesDto = _mapper.Map<List<FilmRoleBasicDto>>(filmRoles);
                var response =  ApiResponse<List<FilmRoleBasicDto>>.SuccessResponse(filmRolesDto);

                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<FilmRoleBasicDto>>.ErrorResponse(ex.Message);
            }
        }
    }
}
