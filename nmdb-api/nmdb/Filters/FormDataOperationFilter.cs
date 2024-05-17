using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace nmdb.Filters;

public class FormDataOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.RequestBody != null && operation.RequestBody.Content.ContainsKey("application/x-www-form-urlencoded"))
        {
            var properties = context.MethodInfo.GetParameters()
                .SelectMany(p => p.ParameterType.GetProperties())
                .Where(p => p.PropertyType.IsGenericType && p.PropertyType.GetGenericTypeDefinition() == typeof(List<>));

            foreach (var property in properties)
            {
                var propertyType = property.PropertyType.GetGenericArguments()[0];
                foreach (var prop in propertyType.GetProperties())
                {
                    operation.RequestBody.Content["application/x-www-form-urlencoded"].Schema.Properties
                        .Add($"{property.Name}[].{prop.Name}", new OpenApiSchema
                        {
                            Type = prop.PropertyType.Name.ToLower()
                        });
                }
            }
        }
    }
}
