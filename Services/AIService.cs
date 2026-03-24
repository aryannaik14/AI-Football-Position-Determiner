using System.Text;
using System.Text.Json;
using FootballPositionAPI.Domain;
using Microsoft.Extensions.Configuration;

namespace FootballPositionAPI.Services
{
    public class MLPredictResult
    {
        public string predicted_position { get; set; } = string.Empty;
        public double confidence { get; set; }
    }

    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public AIService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<(string position, double confidence)> PredictPosition(Player player)
        {
            var data = new
            {
                height = player.Height,
                weight = player.Weight,
                speed = player.Speed,
                stamina = player.Stamina,
                strength = player.Strength,
                passing = player.Passing,
                dribbling = player.Dribbling,
                vision = player.Vision,
                shooting = player.Shooting,
                defending = player.Defending
            };

            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var mlUrl = _config["MLService:BaseUrl"] ?? "http://127.0.0.1:5000";
            var response = await _httpClient.PostAsync($"{mlUrl}/predict", content);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadAsStringAsync();
            var opts = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var prediction = JsonSerializer.Deserialize<MLPredictResult>(result, opts)!;
            return (prediction.predicted_position, prediction.confidence);
        }
    }
}