using Application.Abstractions.Messaging;
using Application.Interfaces;
using Core;
using Core.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Application.CQRS.FilmRoles.Queries.GetFilmRoleById
{
    internal sealed class GetFilmRoleByIdQueryHandler
        : IQueryHandler<GetFilmRoleByIdQuery, FilmRoleResponseDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetFilmRoleByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<FilmRoleResponseDto>> Handle(GetFilmRoleByIdQuery request, CancellationToken cancellationToken)
        {
            var filmRole = await _unitOfWork.FilmRoleRepository.GetByIdAsync(request.FilmRoleId);
            if (filmRole == null)
            {
                return ApiResponse<FilmRoleResponseDto>.ErrorResponse($"The film role with Id {request.FilmRoleId} was not found.", HttpStatusCode.NotFound);
                //return Result.Failure<FilmRoleResponse>(new Error(
                //    "FilmRole.NotFound",
                //    $"The film role with Id {request.FilmRoleId} was not found."
                //    ));
            }
            // Get Include Properties Also in the generic
            var filmRoleCategory = await _unitOfWork.FilmRoleCategoryRepository.GetByIdAsync(filmRole.RoleCategoryId);
            var response = new FilmRoleResponseDto(filmRole.Id, filmRole.RoleName, filmRoleCategory.Id, filmRoleCategory.CategoryName, filmRole.DisplayOrder);
            return ApiResponse<FilmRoleResponseDto>.SuccessResponse(response);
        }
    }
}
