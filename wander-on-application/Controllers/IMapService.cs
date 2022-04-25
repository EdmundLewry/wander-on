namespace cbs.wanderOn.Controllers;

public interface IMapService
{
    string GetTravelData();
    void SaveTravelData(string data);
}