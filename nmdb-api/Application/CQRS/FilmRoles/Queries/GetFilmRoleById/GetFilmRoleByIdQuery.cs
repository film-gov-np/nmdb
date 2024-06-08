using Application.Abstractions.Messaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.CQRS.FilmRoles.Queries.GetFilmRoleById
{
    public sealed record GetFilmRoleByIdQuery(int FilmRoleId) : IQuery<FilmRoleResponseDto>;
}
