using Application.Dtos.FilterParameters;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;
using System.Linq.Expressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Infrastructure.Repositories
{
    public class EfRepository<TEntity> : IEfRepository<TEntity> where TEntity : class
    {
        private readonly DbContext _context;
        private readonly DbSet<TEntity> _dbSet;

        public EfRepository(DbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<TEntity>();
        }
        public virtual async Task<(IQueryable<TEntity> Query, int TotalItems)> GetWithFilter<TFilterParameters>(
                    TFilterParameters filterParams = null,
                    Expression<Func<TEntity, bool>> filter = null,
                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                    Expression<Func<TEntity, object>> orderByColumn = null) where TFilterParameters : BaseFilterParameters
        {
            IQueryable<TEntity> query = filterParams.EnableNoTracking ? _dbSet.AsNoTracking() : _dbSet;

            if (filterParams.RetrieveAll)
            {
                if (orderByColumn != null)
                {
                    if (filterParams.Descending)
                    {
                        query = query.OrderByDescending(orderByColumn);
                    }
                    else
                    {
                        query = query.OrderBy(orderByColumn);
                    }
                }
                if (!string.IsNullOrEmpty(filterParams.SearchKeyword))
                {
                    query = query.Where(filter);
                }
                return (query, await query.CountAsync());
            }

            if (filterParams.IgnoreQueryFilters)
            {
                query = query.IgnoreQueryFilters();
            }

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (!string.IsNullOrEmpty(filterParams.IncludeProperties))
            {
                var propertiesToInclude = filterParams.IncludeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var includeProperty in propertiesToInclude)
                {
                    query = query.Include(includeProperty.Trim());
                }
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }
            else if (orderByColumn != null)
            {
                if (filterParams.Descending)
                {
                    query = query.OrderByDescending(orderByColumn);
                }
                else
                {
                    query = query.OrderBy(orderByColumn);
                }
            }

            int totalItems = await query.CountAsync();

            // paginate the result
            var skip = (filterParams.PageNumber - 1) * filterParams.PageSize;
            query = query.Skip(skip).Take(filterParams.PageSize);


            return (query, totalItems);
        }
        public virtual IQueryable<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null
            , Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null
            , Expression<Func<TEntity, object>> orderByColumn = null
            , string includeProperties = ""
            , int? pageNumber = default(int?)
            , int? pageSize = default(int?)
            , bool enableNoTracking = true
            , bool ignoreQueryFilters = false
            , bool descending = false)
        {
            IQueryable<TEntity> query = enableNoTracking ? _dbSet.AsNoTracking() : _dbSet;


            if (ignoreQueryFilters)
            {
                query = query.IgnoreQueryFilters();
            }

            if (filter != null)
            {
                query = query.Where(filter);
            }

            var propertiesToInclude = includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var includeProperty in propertiesToInclude)
            {
                query = query.Include(includeProperty.Trim());
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }
            else if (orderByColumn != null)
            {
                if (descending)
                {
                    query = query.OrderByDescending(orderByColumn);
                }
                else
                {
                    query = query.OrderBy(orderByColumn);
                }
            }
            if (pageNumber != null && pageSize != null)
            {
                var skip = ((int)pageNumber - 1) * (int)pageSize;
                query = query.Skip(skip).Take((int)pageSize);
            }
            return query;
        }

        public async Task<TEntity> GetByIdAsync(object id, string includeProperties = "")
        {
            //var entity = await _dbSet.FindAsync(id);
            var query = _dbSet.AsQueryable();

            // Apply filtering by ID
            query = query.Where(e => EF.Property<object>(e, "Id") == id);
            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty.Trim());
                    //await _context.Entry(entity).Collection(includeProperty.Trim()).LoadAsync();
                }
            }
            var entity = await query.FirstOrDefaultAsync();
            return entity;
        }
        public async Task<TEntity> GetByEmailAsync(string email, string includeProperties = "")
        {
            var query = _dbSet.AsQueryable();

            // Apply filtering by Email
            query = query.Where(e => EF.Property<string>(e, "Email") == email);

            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty.Trim());
                }
            }

            var entity = await query.FirstOrDefaultAsync();
            return entity;
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
            return entity;
        }

        public async Task<TEntity> UpdateAsync(TEntity entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            return entity;
        }

        public async Task<bool> DeleteAsync(object id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            return true;
        }
    }
}
