namespace cbs.wanderOn.Controllers;

public class MapService : IMapService
{
    private readonly string _filePath = "./routes.json";

    public ILogger<MapService> Logger { get; }

    public MapService(ILogger<MapService> logger)
    {
        Logger = logger;
    }

    public string GetTravelData()
    {
        if(!File.Exists(_filePath))
            return "";

        string data = File.ReadAllText(_filePath);
        return data;
    }

    public void SaveTravelData(string data)
    {
        File.WriteAllText(_filePath, data);
    }
}
