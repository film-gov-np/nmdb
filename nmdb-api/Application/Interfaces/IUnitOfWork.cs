﻿using Application.Interfaces.Repositories;

namespace Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRolesRepository RolesRepository { get; }
        Task CommitAsync();
    }
}