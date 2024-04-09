using Application.Abstractions.Messaging;
using Core;


namespace Application.CQRS.FilmRoles.Commands.CreateFilmRole;

public sealed record CreateFilmRoleCommand(
    string RoleName,
    int DisplayOrder,
    int RoleCategoryId
    ):ICommand<string>;
