using Application.Dtos.FilterParameters;
using System.Linq.Expressions;

namespace Application.Interfaces;

public interface IEfRepository<TEntity> where TEntity : class
{
    IQueryable<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null
            , Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null
            , Expression<Func<TEntity, object>> orderByColumn = null
            , string includeProperties = ""
            , int? pageNumber = default(int?)
            , int? pageSize = default(int?)
            , bool enableNoTracking = true
            , bool ignoreQueryFilters = false
            , bool descending = false);
    Task<TEntity> GetByIdAsync(object id, string includeProperties="");
    Task<TEntity> GetByEmailAsync(string email, string includeProperties="");
    Task<TEntity> AddAsync(TEntity entity);
    Task<TEntity> UpdateAsync(TEntity entity);
    Task<bool> DeleteAsync(object id);
    Task<(IQueryable<TEntity> Query, int TotalItems)> GetWithFilter<TFilterParameters>(
        TFilterParameters filterParams = null,
        Expression<Func<TEntity, bool>> filterExpression = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Expression<Func<TEntity, object>> orderByColumnExpression = null) where TFilterParameters : BaseFilterParameters;
}