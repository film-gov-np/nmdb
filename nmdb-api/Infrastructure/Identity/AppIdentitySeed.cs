using Application.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity;

public static class DefaultRoles
{
    public const string ADMINSTRATOR = "Admin";
    public const string User = "User";
}
public class AppIdentitySeed
{
    private const string Password = "Hello@123";
    public static async Task SeedAsync(AppDbContext identityContext, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
    {
        try
        {
            if (identityContext.Database.IsSqlServer())
            {
                identityContext.Database.Migrate();
            }

            //await roleManager.CreateAsync(new ApplicationRole(Roles.ADMINISTRATORS));
            if (!identityContext.Roles.Any())
            {
                await roleManager.CreateAsync(new ApplicationRole
                {
                    Name = DefaultRoles.ADMINSTRATOR,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "superuser@nmdb.com"
                });
                await roleManager.CreateAsync(new ApplicationRole
                {
                    Name = DefaultRoles.User,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "superuser@nmdb.com"
                });
            }

            string defaultUserName = "defaultuser@nmdb.com";
            var defaultUser = new ApplicationUser
            {
                UserName = defaultUserName,
                Email = defaultUserName,
                CreatedBy = "superuser@nmdb.com"
            };
            await userManager.CreateAsync(defaultUser, Password);

            string adminUserName = "defaultadmin@nepticstech.com";
            var adminUser = new ApplicationUser
            {
                UserName = adminUserName,
                Email = adminUserName,
                CreatedBy = "superuser@nmdb.com"
            };
            await userManager.CreateAsync(adminUser, Password);

            adminUser = await userManager.FindByNameAsync(adminUserName);

            if (adminUser is not null)
            {
                await userManager.AddToRoleAsync(adminUser, DefaultRoles.ADMINSTRATOR);
            }

            defaultUser = await userManager.FindByNameAsync(defaultUserName);
            if (defaultUser is not null)
            {
                await userManager.AddToRoleAsync(defaultUser, DefaultRoles.User);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Exception thrown during seeding database", ex.Message);
            throw;
        }
    }

}
