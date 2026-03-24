namespace FootballPositionAPI.Domain
{
    public class Prediction
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public Player? Player { get; set; }
        public string PredictedPosition { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public DateTime PredictionDate { get; set; } = DateTime.UtcNow;
    }
}