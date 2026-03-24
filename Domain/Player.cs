namespace FootballPositionAPI.Domain
{
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }
        public int Speed { get; set; }
        public int Stamina { get; set; }
        public int Strength { get; set; }
        public int Passing { get; set; }
        public int Dribbling { get; set; }
        public int Vision { get; set; }
        public int Shooting { get; set; }
        public int Defending { get; set; }
        public string Position { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }
        public User? User { get; set; }
        public ICollection<Prediction> Predictions { get; set; } = new List<Prediction>();
    }
}