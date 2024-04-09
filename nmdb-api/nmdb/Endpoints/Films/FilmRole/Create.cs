using Application.CQRS.FilmRoles.Commands.CreateFilmRole;
using Core;
using Core.Constants;
using FastEndpoints;
using MediatR;

namespace nmdb.Endpoints.Films.FilmRole;

public class Create
    : Endpoint<CreateFilmRoleRequest, ApiResponse<string>>
{
    private readonly ISender _sender;
    private readonly AutoMapper.IMapper _mapper;
    public Create(ISender sender, AutoMapper.IMapper mapper)
    {
        _mapper = mapper;
        _sender = sender;
    }
    public override void Configure()
    {
        Post(CreateFilmRoleRequest.Route);
        Roles(AuthorizationConstants.AdminRole);
        Summary(s =>
        {
            s.ExampleRequest = new CreateFilmRoleRequest
            {
                RoleName = "Focus",
                RoleCategoryId = 1,
                DisplayOrder = 1
            };
        });
    }

    public override async Task HandleAsync(CreateFilmRoleRequest request, CancellationToken cancellationToken)
    {
        var command = _mapper.Map<CreateFilmRoleCommand>(request);
        var result = await _sender.Send(command, cancellationToken);
        if (!result.IsSuccess)
            Response = result;// await SendStringAsync("Something went wrong while creating movie");
        await SendOkAsync(result);
    }
}
