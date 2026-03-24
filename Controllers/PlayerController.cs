using FootballPositionAPI.Domain;
using FootballPositionAPI.DTOs;
using FootballPositionAPI.Infrastructure;
using FootballPositionAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FootballPositionAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PlayerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AIService _aiService;

        public PlayerController(AppDbContext context, AIService aiService)
        {
            _context = context;
            _aiService = aiService;
        }

        private int UserId => int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET: api/player
        [HttpGet]
        public async Task<IActionResult> GetPlayers()
        {
            var players = await _context.Players
                .Where(p => p.UserId == UserId)
                .Include(p => p.Predictions)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var response = players.Select(MapToResponse);
            return Ok(response);
        }

        // POST: api/player
        [HttpPost]
        public async Task<IActionResult> AddPlayer(
            [FromBody] CreatePlayerRequest request)
        {
            var player = new Player
            {
                Name = request.Name,
                Age = request.Age,
                Height = request.Height,
                Weight = request.Weight,
                Speed = request.Speed,
                Stamina = request.Stamina,
                Strength = request.Strength,
                Passing = request.Passing,
                Dribbling = request.Dribbling,
                Vision = request.Vision,
                Shooting = request.Shooting,
                Defending = request.Defending,
                UserId = UserId
            };

            var (position, confidence) = await _aiService.PredictPosition(player);
            player.Position = position;

            _context.Players.Add(player);
            await _context.SaveChangesAsync();

            // Save prediction history
            var prediction = new Prediction
            {
                PlayerId = player.Id,
                PredictedPosition = position,
                Confidence = confidence,
                PredictionDate = DateTime.UtcNow
            };
            _context.Predictions.Add(prediction);
            await _context.SaveChangesAsync();

            return Ok(MapToResponse(player));
        }

        // POST: api/player/{id}/predict
        [HttpPost("{id:int}/predict")]
        public async Task<IActionResult> Predict(int id)
        {
            var player = await _context.Players
                .Include(p => p.Predictions)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == UserId);

            if (player == null) return NotFound();

            var (position, confidence) = await _aiService.PredictPosition(player);
            player.Position = position;

            var prediction = new Prediction
            {
                PlayerId = player.Id,
                PredictedPosition = position,
                Confidence = confidence,
                PredictionDate = DateTime.UtcNow
            };

            _context.Predictions.Add(prediction);
            await _context.SaveChangesAsync();

            return Ok(new PredictionResponse(
                prediction.Id,
                prediction.PredictedPosition,
                prediction.Confidence,
                prediction.PredictionDate,
                player.Id,
                player.Name));
        }

        // DELETE: api/player/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var player = await _context.Players
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == UserId);

            if (player == null) return NotFound();

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/player/predictions
        [HttpGet("predictions")]
        public async Task<IActionResult> GetHistory()
        {
            var preds = await _context.Predictions
                .Include(p => p.Player)
                .Where(p => p.Player!.UserId == UserId)
                .OrderByDescending(p => p.PredictionDate)
                .ToListAsync();

            var response = preds.Select(p => new PredictionResponse(
                p.Id,
                p.PredictedPosition,
                p.Confidence,
                p.PredictionDate,
                p.PlayerId,
                p.Player?.Name));

            return Ok(response);
        }

        private static PlayerResponse MapToResponse(Player p) => new(
            p.Id, p.Name, p.Age, p.Height, p.Weight,
            p.Speed, p.Stamina, p.Strength, p.Passing,
            p.Dribbling, p.Vision, p.Shooting, p.Defending,
            p.Position, p.CreatedAt,
            p.Predictions
                .OrderByDescending(x => x.PredictionDate)
                .Select(pred => new PredictionResponse(
                    pred.Id, pred.PredictedPosition,
                    pred.Confidence, pred.PredictionDate))
                .ToList());
    }
}