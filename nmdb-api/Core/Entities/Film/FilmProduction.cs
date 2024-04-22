using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities.Film
{
    public class FilmProduction : BaseEntity<int>
    {
        public long UserId { get; set; }

        [Required]        
        public string SubmissionId { get; set; }

        public string Name { get; set; }
        public string? Address { get; set; }
        [MaxLength(20)]
        public string? OfficePhone { get; set; }
        public string? HousePhone { get; set; }
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
        public string? IdentityNumber { get; set; }
        public string? IdentityIssuingOfficer { get; set; }
        public string? IdentityIssuedDate { get; set; }
        public string? RegistrationNumber { get; set; }
        public string? RegistrationDate { get; set; }
        public string? OfficeName { get; set; }
        public string? ShareholderName { get; set; }
        public string? ShareholderAddress { get; set; }
        public string? ShareholderMobileNumber { get; set; }
        public string? OfficeRegistrationPhotocopy { get; set; }
        public string? TaxRegistrationPhotocopy { get; set; }
        public string? MovieType { get; set; }
        public string? MovieShape { get; set; }
        public string? MovieNepaliName { get; set; }
        public string? MovieEnglishName { get; set; }
        public string? MovieLanguage { get; set; }
        public string? MovieTechnology { get; set; }
        public string? CameraType { get; set; }
        public string? CameraMagazine { get; set; }
        public string? StorytellingAndSong { get; set; }
        public string? StorywriterName { get; set; }
        public string? PublisherName { get; set; }
        public string? SingerName { get; set; }
        public string? DirectorName { get; set; }
        public string? MainArtistName { get; set; }
        public string? MatchingNonMatchingName { get; set; }
        public string? ShootingPlace { get; set; }
        public string? NepaliArtistNumber { get; set; }
        public string? ForiegnArtistNumber { get; set; }
        public string? NepaliTechnicianNumber { get; set; }
        public string? ForiegnTechnicianNumber { get; set; }
        public string? ArtistRemuneration { get; set; }
        public string? TechnicianRemuneration { get; set; }
        public string? LabExpenses { get; set; }
        public string? EquipmentExpenses { get; set; }
        public string? LocationExpenses { get; set; }
        public string? AdvertisementExpenses { get; set; }
        public string? OtherExpenses { get; set; }
        public string? MovieDevelopmentMotive { get; set; }
        public string? DisplayAppearance { get; set; }
        public string? BoardSpecifiedOtherThings { get; set; }
        public string? DisplayType { get; set; }
        public string? OperatorsCitizenshipPhotocopy { get; set; }
        public string? IndustryFirmRegistrationPhototcopy { get; set; }
        public string? IncomeTaxPaymentRegistrationPhotocopy { get; set; }
        public string? StorytellingSongEachPageSignaturePhotocopy { get; set; }
        public string? MainartistDirectorAgreementPhotocopy { get; set; }
        public string? InsuranceOriginalVoucher { get; set; }
        public string? PostofficeTicketWithCompanyStamp { get; set; }

        [Required]
        [StringLength(8)]
        public string ApplicationStatus { get; set; }

        [Required]
        public bool IsSeen { get; set; } = false;
    }
}
