namespace Application.Dtos.Theatre;

public class TheatreBaseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ContactName { get; set; }
    public string ContactNumber { get; set; }
    public bool IsRunning { get; set; }

    public TheatreBaseDto()
    {
        Id = 0;
        Name = string.Empty;
        ContactName = string.Empty;
        ContactNumber = string.Empty;
        IsRunning = false;
    }
}
