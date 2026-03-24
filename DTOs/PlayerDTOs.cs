namespace FootballPositionAPI.DTOs
{
    public record CreatePlayerRequest(
        string Name,
        int Age,
        double Height,
        double Weight,
        int Speed,
        int Stamina,
        int Strength,
        int Passing,
        int Dribbling,
        int Vision,
        int Shooting,
        int Defending);

    public record PlayerResponse(
        int Id,
        string Name,
        int Age,
        double Height,
        double Weight,
        int Speed,
        int Stamina,
        int Strength,
        int Passing,
        int Dribbling,
        int Vision,
        int Shooting,
        int Defending,
        string Position,
        DateTime CreatedAt,
        List<PredictionResponse> Predictions);

    public record PredictionResponse(
        int Id,
        string PredictedPosition,
        double Confidence,
        DateTime PredictionDate,
        int? PlayerId = null,
        string? PlayerName = null);
}