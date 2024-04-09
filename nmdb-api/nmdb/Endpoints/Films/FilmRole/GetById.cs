using FastEndpoints;
using Core;
using Infrastructure.Data;
using Core.Constants;
using MediatR;
using Application.CQRS.FilmRoles.Queries;
using Application.CQRS.FilmRoles.Queries.GetFilmRoleById;

namespace nmdb.Endpoints.Films.FilmRole;

public class GetById(ISender sender, AutoMapper.IMapper mapper)
    : Endpoint<GetFilmRoleByIdRequest, ApiResponse<FilmRoleResponse>>
{
    public override void Configure()
    {
        Get(GetFilmRoleByIdRequest.Route);
        Roles(AuthorizationConstants.AdminRole);
    }

    public override async Task HandleAsync(GetFilmRoleByIdRequest request,
      CancellationToken cancellationToken)
    {
        var query = new GetFilmRoleByIdQuery(request.FilmRoleId);
        var response = await sender.Send(query, cancellationToken);
        await SendAsync(response);
    }
}