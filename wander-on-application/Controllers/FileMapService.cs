namespace cbs.wanderOn.Controllers;

public class FileMapService : IMapService
{
    private readonly string _filePath = "routes.json";

    public ILogger<FileMapService> Logger { get; }

    public FileMapService(ILogger<FileMapService> logger)
    {
        Logger = logger;
    }

    public string GetTravelData(string profile)
    {
        string file = $"{profile}-{_filePath}";

        if(!File.Exists(file))
            return "";

        string data = File.ReadAllText(file);
        return data;
    }

    public void SaveTravelData(string profile, string data)
    {
        string file = $"{profile}-{_filePath}";
        File.WriteAllText(file, data);
    }
}
