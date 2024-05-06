
namespace Application.Dtos.FilterParameters;

public class ProductionHouseFilterParameters:BaseFilterParameters
{
    public bool IsRunning { get; set; } = false;
}
