using Npgsql;

namespace AuditTrailService.Repository
{
    public class AuditCommandFactory : IAuditCommandFactory
    {
        private readonly IConfiguration _config;

        public AuditCommandFactory(IConfiguration config)
        {
            _config = config;
        }

        public async Task<NpgsqlCommand> CreateAuditCommandAsync()
        {
            var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand(@"
            SELECT audit.insert_audit_log(
                @p_actor_id,
                @p_actor_type,
                @p_actor_role,
                @p_action,
                @p_entity_type,
                @p_entity_id,
                @p_prev_state,
                @p_new_state,
                @p_action_result,
                @p_ip_address,
                @p_user_agent,
                @p_channel,
                @p_metadata
            )", conn);

            return cmd;
        }
    }
}
