namespace Core.Entities;

public class MovieProductionHouse : BaseEntity<int>
{
    public int MovieId { get; set; }
    public Movie Movie { get; set; }
    public int ProductionHouseId { get; set; }
    public ProductionHouse ProductionHouse { get; set; }   

}
