using Microsoft.AspNetCore.Mvc;

namespace cbs.wanderOn.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapController : ControllerBase 
{
    private ILogger<MapController> Logger {get; set;}
    private IMapService MapService { get; set; }

    private readonly string[] _availableProfiles = new string[2]{"Edmund", "Teddy"};

    public MapController(ILogger<MapController> logger, IMapService mapService) 
    {
        Logger = logger;
        MapService = mapService;
    }

    [HttpGet]
    public string GetTravelledRoutes([FromQuery] string profile)
    {
        Logger.LogInformation($"GET request received - {profile} ");
        return MapService.GetTravelData(profile);
    }

    [HttpPost]
    public void DeliverTravelledRoutes([FromQuery] string profile, [FromBody] object data)
    {
        Logger.LogInformation($"POST request received {profile}");
        MapService.SaveTravelData(profile, data.ToString()!);
    }
}