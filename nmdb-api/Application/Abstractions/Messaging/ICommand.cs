using Core;
using Core.Shared;
using MediatR;

namespace Application.Abstractions.Messaging;

//public interface ICommand : IRequest<ApiResponse>
//{
//}

public interface ICommand<TResponse> : IRequest<ApiResponse<TResponse>>
{
}

