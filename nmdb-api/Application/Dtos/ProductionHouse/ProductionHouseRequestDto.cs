using System.Text.Json.Serialization;

namespace Application.Dtos.ProductionHouse
{
    public class ProductionHouseRequestDto : ProductionHouseBaseDto
    {
        public string Address { get; set; }
        public string EstablishedDate { get; set; }
        public string ChairmanName { get; set; }

        [JsonIgnore]
        public string? AuditedBy { get; set; }
    }
}
