using GeoJSON.Text.Feature;
using Microsoft.AspNetCore.Mvc;

namespace cbs.wanderOn.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapController : ControllerBase 
{
    private ILogger<MapController> Logger {get; set;}
    private IMapService MapService { get; set; }

    public MapController(ILogger<MapController> logger, IMapService mapService) 
    {
        Logger = logger;
        MapService = mapService;
    }

    [HttpGet]
    public string GetTravelledRoutes()
    {
        Logger.LogInformation("GET request received");
        return MapService.GetTravelData();
    }

    [HttpPost]
    public void DeliverTravelledRoutes(object data)
    {
        Logger.LogInformation($"POST request received");
        MapService.SaveTravelData(data.ToString()!);
    }
}