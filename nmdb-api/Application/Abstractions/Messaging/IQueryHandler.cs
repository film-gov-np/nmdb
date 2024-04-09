using Core;
using Core.Shared;
using MediatR;

namespace Application.Abstractions.Messaging;

public interface IQueryHandler<TQuery, TResponse>
    : IRequestHandler<TQuery, ApiResponse<TResponse>>
    where TQuery : IQuery<TResponse>
{
}
