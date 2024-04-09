using Core;
using Core.Shared;
using MediatR;

namespace Application.Abstractions.Messaging;

public interface IQuery<TResponse> : IRequest<ApiResponse<TResponse>>
{
}
