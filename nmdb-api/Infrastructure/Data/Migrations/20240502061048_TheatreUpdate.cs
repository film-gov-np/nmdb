using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class TheatreUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Theatres");

            migrationBuilder.DropColumn(
                name: "TypeCategory",
                table: "Theatres");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Theatres",
                newName: "IsRunning");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsRunning",
                table: "Theatres",
                newName: "IsActive");

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Theatres",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TypeCategory",
                table: "Theatres",
                type: "int",
                nullable: true);
        }
    }
}
