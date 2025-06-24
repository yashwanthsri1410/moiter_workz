using Npgsql;

namespace AuditTrailService.Repository
{
    public interface IAuditCommandFactory
    {
        Task<NpgsqlCommand> CreateAuditCommandAsync();
    }
}
