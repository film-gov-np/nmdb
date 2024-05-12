using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class StudioToProductionHouse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovieStudios_Movies_MovieId",
                table: "MovieStudios");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieStudios_Studios_StudioId",
                table: "MovieStudios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieStudios",
                table: "MovieStudios");

            migrationBuilder.RenameTable(
                name: "MovieStudios",
                newName: "MovieStudio");

            migrationBuilder.RenameIndex(
                name: "IX_MovieStudios_StudioId",
                table: "MovieStudio",
                newName: "IX_MovieStudio_StudioId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieStudio",
                table: "MovieStudio",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "MovieProductionHouses",
                columns: table => new
                {
                    MovieId = table.Column<int>(type: "int", nullable: false),
                    ProductionHouseId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue:DateTime.Now),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue:false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieProductionHouses", x => new { x.MovieId, x.ProductionHouseId });
                    table.ForeignKey(
                        name: "FK_MovieProductionHouses_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieProductionHouses_ProductionHouses_ProductionHouseId",
                        column: x => x.ProductionHouseId,
                        principalTable: "ProductionHouses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovieStudio_MovieId",
                table: "MovieStudio",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieProductionHouses_ProductionHouseId",
                table: "MovieProductionHouses",
                column: "ProductionHouseId");

            migrationBuilder.AddForeignKey(
                name: "FK_MovieStudio_Movies_MovieId",
                table: "MovieStudio",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MovieStudio_Studios_StudioId",
                table: "MovieStudio",
                column: "StudioId",
                principalTable: "Studios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovieStudio_Movies_MovieId",
                table: "MovieStudio");

            migrationBuilder.DropForeignKey(
                name: "FK_MovieStudio_Studios_StudioId",
                table: "MovieStudio");

            migrationBuilder.DropTable(
                name: "MovieProductionHouses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieStudio",
                table: "MovieStudio");

            migrationBuilder.DropIndex(
                name: "IX_MovieStudio_MovieId",
                table: "MovieStudio");

            migrationBuilder.RenameTable(
                name: "MovieStudio",
                newName: "MovieStudios");

            migrationBuilder.RenameIndex(
                name: "IX_MovieStudio_StudioId",
                table: "MovieStudios",
                newName: "IX_MovieStudios_StudioId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieStudios",
                table: "MovieStudios",
                columns: new[] { "MovieId", "StudioId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MovieStudios_Movies_MovieId",
                table: "MovieStudios",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MovieStudios_Studios_StudioId",
                table: "MovieStudios",
                column: "StudioId",
                principalTable: "Studios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
