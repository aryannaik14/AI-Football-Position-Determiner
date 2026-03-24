using FootballPositionAPI.Domain;
using FootballPositionAPI.DTOs;
using FootballPositionAPI.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FootballPositionAPI.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Email already registered.");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return BuildToken(user);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                           .FirstOrDefaultAsync(u => u.Email == request.Email)
                       ?? throw new UnauthorizedAccessException("Invalid credentials.");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials.");

            return BuildToken(user);
        }

        private AuthResponse BuildToken(User user)
        {
            var expHours = int.Parse(_config["Jwt:ExpirationHours"] ?? "24");
            var expiry = DateTime.UtcNow.AddHours(expHours);
            var key = new SymmetricSecurityKey(
                               Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email,           user.Email),
                new Claim(ClaimTypes.Name,            user.Username)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expiry,
                signingCredentials: new SigningCredentials(
                                        key, SecurityAlgorithms.HmacSha256));

            return new AuthResponse(
                Token: new JwtSecurityTokenHandler().WriteToken(token),
                Username: user.Username,
                Email: user.Email,
                ExpiresAt: expiry);
        }
    }
}