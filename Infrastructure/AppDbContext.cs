using Microsoft.EntityFrameworkCore;
using FootballPositionAPI.Domain;

namespace FootballPositionAPI.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Player> Players => Set<Player>();
        public DbSet<Prediction> Predictions => Set<Prediction>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(e =>
            {
                e.HasIndex(u => u.Email).IsUnique();
                e.HasMany(u => u.Players)
                 .WithOne(p => p.User)
                 .HasForeignKey(p => p.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Player>(e =>
            {
                e.HasMany(p => p.Predictions)
                 .WithOne(pr => pr.Player)
                 .HasForeignKey(pr => pr.PlayerId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}