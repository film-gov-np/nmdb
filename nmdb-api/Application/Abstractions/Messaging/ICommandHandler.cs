using Core;
using Core.Shared;
using MediatR;

namespace Application.Abstractions.Messaging;

//public interface ICommandHandler<TCommand>
//    : IRequestHandler<TCommand, ApiResponse>
//    where TCommand : ICommand
//{
//}

public interface ICommandHandler<TCommand, TResponse>
    : IRequestHandler<TCommand, ApiResponse<TResponse>>
    where TCommand : ICommand<TResponse>
{ }
