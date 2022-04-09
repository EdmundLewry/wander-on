using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace cbs.wanderOn.Controllers;

[ApiController]
[Route("[controller]")]
public class MapController : ControllerBase {
    private ILogger<MapController> Logger {get; set;};
    private MapService MapService { get; private set; }

    private readonly string _filePath = "";

    public MapController(ILogger<MapController> logger, MapService mapService) 
    {
        Logger = logger;
        MapService = mapService;
    }

    [HttpGet]
    public string GetTravelledRoutes()
    {
        return MapService.GetTravelData();
    }
}