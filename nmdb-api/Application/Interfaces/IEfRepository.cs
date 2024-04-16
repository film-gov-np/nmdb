using System.Linq.Expressions;

namespace Application.Interfaces
{
    public interface IEfRepository<TEntity> where TEntity : class
    {
        IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "", int? pageNumber = default(int?), int? pageSize = default(int?), bool enableNoTracking = true, bool ignoreQueryFilters = false);
        Task<TEntity> GetByIdAsync(object id);
        Task<TEntity> AddAsync(TEntity entity);
        Task<TEntity> UpdateAsync(TEntity entity);
        Task<bool> DeleteAsync(object id);
    }
}
