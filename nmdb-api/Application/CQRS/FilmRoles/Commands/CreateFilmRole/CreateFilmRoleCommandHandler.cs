using Core.Entities;
using Application.Abstractions.Messaging;
using Application.Interfaces;
using Core.Shared;
using AutoMapper;
using Core.Constants;
using Core;
using MediatR;

namespace Application.CQRS.FilmRoles.Commands.CreateFilmRole;

internal sealed class CreateFilmRoleCommandHandler : ICommandHandler<CreateFilmRoleCommand, string>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateFilmRoleCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<ApiResponse<string>> Handle(CreateFilmRoleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var category = _unitOfWork.FilmRoleCategoryRepository.GetByIdAsync(request.RoleCategoryId).Result;
            var filmRole = _mapper.Map<FilmRole>(request);
            //filmRole.RoleCategory = category;
            filmRole.CreatedBy = AuthorizationConstants.SuperUser;
            await _unitOfWork.FilmRoleRepository.AddAsync(filmRole);
            await _unitOfWork.CommitAsync(cancellationToken);
            return ApiResponse<string>.SuccessResponse("Film Role created successfully.");
            //return Result.Success("Film Role created successfully.");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResponse($"Something went wrong while creating new film role. {ex.Message.ToString()}");
            //return Result.Failure(new Error("FilmRole.Create", $"Something went wrong while creating new film role. {ex.Message.ToString()}"));
        }
    }
}
