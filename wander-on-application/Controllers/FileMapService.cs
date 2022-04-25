namespace cbs.wanderOn.Controllers;

public class FileMapService : IMapService
{
    private readonly string _filePath = "./routes.json";

    public ILogger<FileMapService> Logger { get; }

    public FileMapService(ILogger<FileMapService> logger)
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
