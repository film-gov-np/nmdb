namespace Application.Dtos.ProductionHouse;

public class ProductionHouseBaseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string NepaliName { get; set; }
    public string ChairmanName { get; set; }
    public bool IsRunning { get; set; }

    public ProductionHouseBaseDto()
    {
        Id = 0;
        Name = string.Empty;
        NepaliName = string.Empty;
        ChairmanName = string.Empty;
        IsRunning = true;
    }
}
