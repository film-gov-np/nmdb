using Application.Models;
using Core.Constants;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity;

public class AppIdentitySeed
{
    public static async Task SeedAsync(AppDbContext identityContext, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
    {
        try
        {
            if (identityContext.Database.IsSqlServer())
            {
                identityContext.Database.Migrate();
            }

            //await roleManager.CreateAsync(new ApplicationRole(Roles.ADMINISTRATORS));
            string defaultSuperuser = AuthorizationConstants.SuperUser;
            if (!identityContext.Roles.Any())
            {
                await roleManager.CreateAsync(new ApplicationRole
                {
                    Name = AuthorizationConstants.AdminRole,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "superuser@nmdb.com"
                }); ;
                await roleManager.CreateAsync(new ApplicationRole
                {
                    Name = AuthorizationConstants.UserRole,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = defaultSuperuser
                });
            }

            string defaultUserName = AuthorizationConstants.User;
            string defaultPassword = AuthorizationConstants.Password;
            var defaultUser = new ApplicationUser
            {
                UserName = defaultUserName,
                Email = defaultUserName,
                CreatedBy = defaultSuperuser
            };
            await userManager.CreateAsync(defaultUser, defaultPassword);

            string adminUserName = AuthorizationConstants.Admin;
            var adminUser = new ApplicationUser
            {
                UserName = adminUserName,
                Email = adminUserName,
                CreatedBy = defaultSuperuser
            };
            await userManager.CreateAsync(adminUser, defaultPassword);

            adminUser = await userManager.FindByNameAsync(adminUserName);

            if (adminUser is not null)
            {
                await userManager.AddToRoleAsync(adminUser, AuthorizationConstants.AdminRole);
            }

            defaultUser = await userManager.FindByNameAsync(defaultUserName);
            if (defaultUser is not null)
            {
                await userManager.AddToRoleAsync(defaultUser, AuthorizationConstants.UserRole);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Exception thrown during seeding database", ex.Message);
            throw;
        }
    }

}
