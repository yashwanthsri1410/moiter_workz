using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace AuditTrailService.Models
{
    public class AuditDbContext : DbContext
    {
        public AuditDbContext(DbContextOptions<AuditDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
