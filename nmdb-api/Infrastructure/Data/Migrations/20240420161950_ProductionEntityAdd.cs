using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductionEntityAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Roles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "DisplayOrder",
                table: "FilmRoles",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "FilmRoles",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "FilmRoleCategory",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "FilmProductions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    SubmissionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OfficePhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HousePhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MobileNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdentityNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdentityIssuingOfficer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdentityIssuedDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistrationNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistrationDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OfficeName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShareholderName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShareholderAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShareholderMobileNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OfficeRegistrationPhotocopy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaxRegistrationPhotocopy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovieType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovieShape = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovieNepaliName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovieEnglishName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovieLanguage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovieTechnology = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CameraType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CameraMagazine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StorytellingAndSong = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StorywriterName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PublisherName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SingerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DirectorName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MainArtistName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MatchingNonMatchingName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShootingPlace = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NepaliArtistNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ForiegnArtistNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NepaliTechnicianNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ForiegnTechnicianNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ArtistRemuneration = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TechnicianRemuneration = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LabExpenses = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EquipmentExpenses = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LocationExpenses = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdvertisementExpenses = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OtherExpenses = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MovieDevelopmentMotive = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayAppearance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BoardSpecifiedOtherThings = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OperatorsCitizenshipPhotocopy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IndustryFirmRegistrationPhototcopy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IncomeTaxPaymentRegistrationPhotocopy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StorytellingSongEachPageSignaturePhotocopy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MainartistDirectorAgreementPhotocopy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InsuranceOriginalVoucher = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PostofficeTicketWithCompanyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicationStatus = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    IsSeen = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FilmProductions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductionHouses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NepaliName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactPerson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    EstablishedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsRunning = table.Column<bool>(type: "bit", nullable: false),
                    ChairmanName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductionHouses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FilmProductions_SubmissionId",
                table: "FilmProductions",
                column: "SubmissionId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FilmProductions");

            migrationBuilder.DropTable(
                name: "ProductionHouses");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Roles");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DisplayOrder",
                table: "FilmRoles",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "FilmRoles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "FilmRoleCategory",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
