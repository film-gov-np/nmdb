namespace nmdb.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class CustomAuthorizeAttribute : Attribute
    {
        public string[] Roles { get; }

        public CustomAuthorizeAttribute(params string[] roles)
        {
            Roles = roles;
        }
    }
}
