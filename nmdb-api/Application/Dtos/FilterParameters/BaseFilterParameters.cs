using NSwag.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.FilterParameters;

public class BaseFilterParameters
{
    public string? IncludeProperties { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public bool EnableNoTracking { get; set; }
    public bool IgnoreQueryFilters { get; set; }
    public bool Descending { get; set; }
    public bool RetrieveAll { get; set; }
    public string? SearchKeyword { get; set; }
    public string? SortColumn { get; set; }

    public BaseFilterParameters()
    {
        PageNumber = 1;
        PageSize = 10;
        EnableNoTracking = true;
        Descending = false;
        RetrieveAll = false;
        IncludeProperties=string.Empty;
        SearchKeyword = string.Empty;
        SortColumn = string.Empty;
    }
}
