namespace cbs.wanderOn.Controllers;

public interface IMapService
{
    string GetTravelData(string profile);
    void SaveTravelData(string profile, string data);
}