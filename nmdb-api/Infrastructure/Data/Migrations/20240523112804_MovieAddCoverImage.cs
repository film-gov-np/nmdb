using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class MovieAddCoverImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoleNickName",
                table: "MovieCrewRoles");

            migrationBuilder.DropColumn(
                name: "RoleNickNameNepali",
                table: "MovieCrewRoles");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Movies",
                newName: "ThumbnailImage");

            migrationBuilder.AddColumn<string>(
                name: "CoverImage",
                table: "Movies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImage",
                table: "Movies");

            migrationBuilder.RenameColumn(
                name: "ThumbnailImage",
                table: "Movies",
                newName: "Image");

            migrationBuilder.AddColumn<string>(
                name: "RoleNickName",
                table: "MovieCrewRoles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoleNickNameNepali",
                table: "MovieCrewRoles",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
