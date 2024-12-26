namespace Core.Constants;

public static class AuthorizationConstants
{
    public const string SuperUserRole = "Superuser";
    public const string AdminRole = "Admin";
    public const string UserRole = "User";
    public const string CrewRole = "Crew";    

    public const string SuperUser = "superuser@nmdb.com";
    public const string Admin = "admin@nmdb.com";
    public const string User = "user@nmdb.com";


    public const string Password = "Hello@123";

    public static readonly string[] RolesSupported = { SuperUser, Admin, User };
}
