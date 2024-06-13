using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProfilePhotoInUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dbo");

            migrationBuilder.RenameTable(
                name: "UserTokens",
                newName: "UserTokens",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "Users",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "UserRoles",
                newName: "UserRoles",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "UserLogins",
                newName: "UserLogins",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "UserClaims",
                newName: "UserClaims",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Theatres",
                newName: "Theatres",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Studios",
                newName: "Studios",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "Roles",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "RoleClaims",
                newName: "RoleClaims",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "RefreshTokens",
                newName: "RefreshTokens",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "ProductionHouses",
                newName: "ProductionHouses",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieTypes",
                newName: "MovieTypes",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieTheatres",
                newName: "MovieTheatres",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieStudio",
                newName: "MovieStudio",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieStatus",
                newName: "MovieStatus",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Movies",
                newName: "Movies",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieProductionHouses",
                newName: "MovieProductionHouses",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieLanguages",
                newName: "MovieLanguages",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieGenre",
                newName: "MovieGenre",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieCrewRoles",
                newName: "MovieCrewRoles",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MovieCensorInfo",
                newName: "MovieCensorInfo",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Languages",
                newName: "Languages",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Genres",
                newName: "Genres",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "FilmRoles",
                newName: "FilmRoles",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "FilmRoleCategory",
                newName: "FilmRoleCategory",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "FilmProductions",
                newName: "FilmProductions",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Crews",
                newName: "Crews",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "CrewRoles",
                newName: "CrewRoles",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "CardRequests",
                newName: "CardRequests",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Awards",
                newName: "Awards",
                newSchema: "dbo");

            migrationBuilder.AddColumn<string>(
                name: "ProfilePhoto",
                schema: "dbo",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePhoto",
                schema: "dbo",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "UserTokens",
                schema: "dbo",
                newName: "UserTokens");

            migrationBuilder.RenameTable(
                name: "Users",
                schema: "dbo",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "UserRoles",
                schema: "dbo",
                newName: "UserRoles");

            migrationBuilder.RenameTable(
                name: "UserLogins",
                schema: "dbo",
                newName: "UserLogins");

            migrationBuilder.RenameTable(
                name: "UserClaims",
                schema: "dbo",
                newName: "UserClaims");

            migrationBuilder.RenameTable(
                name: "Theatres",
                schema: "dbo",
                newName: "Theatres");

            migrationBuilder.RenameTable(
                name: "Studios",
                schema: "dbo",
                newName: "Studios");

            migrationBuilder.RenameTable(
                name: "Roles",
                schema: "dbo",
                newName: "Roles");

            migrationBuilder.RenameTable(
                name: "RoleClaims",
                schema: "dbo",
                newName: "RoleClaims");

            migrationBuilder.RenameTable(
                name: "RefreshTokens",
                schema: "dbo",
                newName: "RefreshTokens");

            migrationBuilder.RenameTable(
                name: "ProductionHouses",
                schema: "dbo",
                newName: "ProductionHouses");

            migrationBuilder.RenameTable(
                name: "MovieTypes",
                schema: "dbo",
                newName: "MovieTypes");

            migrationBuilder.RenameTable(
                name: "MovieTheatres",
                schema: "dbo",
                newName: "MovieTheatres");

            migrationBuilder.RenameTable(
                name: "MovieStudio",
                schema: "dbo",
                newName: "MovieStudio");

            migrationBuilder.RenameTable(
                name: "MovieStatus",
                schema: "dbo",
                newName: "MovieStatus");

            migrationBuilder.RenameTable(
                name: "Movies",
                schema: "dbo",
                newName: "Movies");

            migrationBuilder.RenameTable(
                name: "MovieProductionHouses",
                schema: "dbo",
                newName: "MovieProductionHouses");

            migrationBuilder.RenameTable(
                name: "MovieLanguages",
                schema: "dbo",
                newName: "MovieLanguages");

            migrationBuilder.RenameTable(
                name: "MovieGenre",
                schema: "dbo",
                newName: "MovieGenre");

            migrationBuilder.RenameTable(
                name: "MovieCrewRoles",
                schema: "dbo",
                newName: "MovieCrewRoles");

            migrationBuilder.RenameTable(
                name: "MovieCensorInfo",
                schema: "dbo",
                newName: "MovieCensorInfo");

            migrationBuilder.RenameTable(
                name: "Languages",
                schema: "dbo",
                newName: "Languages");

            migrationBuilder.RenameTable(
                name: "Genres",
                schema: "dbo",
                newName: "Genres");

            migrationBuilder.RenameTable(
                name: "FilmRoles",
                schema: "dbo",
                newName: "FilmRoles");

            migrationBuilder.RenameTable(
                name: "FilmRoleCategory",
                schema: "dbo",
                newName: "FilmRoleCategory");

            migrationBuilder.RenameTable(
                name: "FilmProductions",
                schema: "dbo",
                newName: "FilmProductions");

            migrationBuilder.RenameTable(
                name: "Crews",
                schema: "dbo",
                newName: "Crews");

            migrationBuilder.RenameTable(
                name: "CrewRoles",
                schema: "dbo",
                newName: "CrewRoles");

            migrationBuilder.RenameTable(
                name: "CardRequests",
                schema: "dbo",
                newName: "CardRequests");

            migrationBuilder.RenameTable(
                name: "Awards",
                schema: "dbo",
                newName: "Awards");
        }
    }
}
