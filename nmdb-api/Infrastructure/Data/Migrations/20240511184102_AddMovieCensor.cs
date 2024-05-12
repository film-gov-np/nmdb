using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMovieCensor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MovieCensorInfo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MovieId = table.Column<int>(type: "int", nullable: false),
                    CertificateNumber = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ApplicationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CensoredDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CensorType = table.Column<int>(type: "int", nullable: false),
                    MovieType = table.Column<int>(type: "int", nullable: false),
                    ReelLength = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ReelSize = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ValidYears = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieCensorInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MovieCensorInfo_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovieCensorInfo_MovieId",
                table: "MovieCensorInfo",
                column: "MovieId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieCensorInfo");
        }
    }
}
