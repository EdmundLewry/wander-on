using cbs.wanderOn.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace cbs.wanderOn.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapController : ControllerBase 
{
    private ILogger<MapController> Logger {get; set;}
    private IMapService MapService { get; set; }
    private ProfileConfig Config {get; set;}

    private readonly string[] _availableProfiles = new string[2]{"Edmund", "Teddy"};

    public MapController(ILogger<MapController> logger, IMapService mapService, IOptions<ProfileConfig> config) 
    {
        Logger = logger;
        MapService = mapService;
        Config = config.Value;
    }

    [HttpGet]
    public string GetTravelledRoutes([FromQuery] string profile)
    {
        Logger.LogInformation($"GET request received - {profile} ");
        if(Config.Keys.ContainsKey(profile))
            return MapService.GetTravelData(Config.Keys[profile]);
        
        Logger.LogError("No profile found for key provided");
        return "";
    }

    [HttpPost]
    public void DeliverTravelledRoutes([FromQuery] string profile, [FromBody] object data)
    {
        Logger.LogInformation($"POST request received {profile}");
        if(Config.Keys.ContainsKey(profile))
        {
            MapService.SaveTravelData(Config.Keys[profile], data.ToString()!);
            return;
        }

        Logger.LogError("No profile found for key provided");
    }
}