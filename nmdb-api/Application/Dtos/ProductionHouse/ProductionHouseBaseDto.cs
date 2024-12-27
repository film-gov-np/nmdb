namespace Application.Dtos.ProductionHouse;

public class ProductionHouseBaseDto: ProductionHouseDto
{

    public string? NepaliName { get; set; }
    public string? ChairmanName { get; set; }
    public bool? IsRunning { get; set; }
}


public class ProductionHouseDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
}