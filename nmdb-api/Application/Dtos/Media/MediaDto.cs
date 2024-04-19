using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Media
{
    public class MediaDTO
    {
        public int Id { get; set; }

        public string MediaGUID { get; set; }

        [Required(ErrorMessage = "You need to select a document first.")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Title*")]
        [StringLength(50)]
        public string DisplayName { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? FilePath { get; set; }

        // [AllowedExtensions(new string[] { ".pdf", ".doc", ".docx", ".xlsx" })]
        public IFormFile? MediaFile { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        [StringLength(150)]
        public string? Description { get; set; }

        //[Required] // hardcode type sent from service
        [Display(Name = "Media Type")]

        public int TypeId { get; set; }
        //[Required] // hardcode category sent from service
        [Display(Name = "Media Category")]
        public int CategoryId { get; set; }


        public string Extension { get; set; }


        public string Size { get; set; }

        public string? MediaType { get; set; }


        public string? MediaCategory { get; set; }    


        public string ModifiedBy { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedOn { get; set; }

        public string LastModifiedBy { get; set; }

        public string LastModifiedOn { get; set; }
    }
}
