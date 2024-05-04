using Microsoft.AspNetCore.Authorization;

namespace nmdb.Filters
{    
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class RequiredRolesAttribute : Attribute
    {
        public string[] Roles { get; }

        public RequiredRolesAttribute(params string[] roles)
        {
            Roles = roles;
        }
    }
}
