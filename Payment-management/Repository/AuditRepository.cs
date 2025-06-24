using AuditTrailService.DTOs;
using AuditTrailService.Model;
using AuditTrailService.Models;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Npgsql.TypeMapping;
using NpgsqlTypes;
using System;
using System.Data;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
    

namespace AuditTrailService.Repository
{
    public class AuditRepository : IAuditRepository
    {
        private readonly IConfiguration _config;
        private readonly IAuditCommandFactory _commandFactory;

        public AuditRepository(IConfiguration config, IAuditCommandFactory commandFactory)
        {
            _config = config;
            _commandFactory = commandFactory;
        }
        public async Task LogAuditAsync(AuditLogDto dto)
        {
            await using var cmd = await _commandFactory.CreateAuditCommandAsync();

            cmd.Parameters.AddWithValue("p_actor_id", dto.actorId);
            cmd.Parameters.AddWithValue("p_actor_type", dto.actorType);
            cmd.Parameters.AddWithValue("p_actor_role", (object?)dto.actorRole ?? DBNull.Value);
            cmd.Parameters.AddWithValue("p_action", dto.action);
            cmd.Parameters.AddWithValue("p_entity_type", dto.entityType);
            cmd.Parameters.AddWithValue("p_entity_id", (object?)dto.entityId ?? DBNull.Value);

            cmd.Parameters.Add(new NpgsqlParameter("p_prev_state", NpgsqlDbType.Jsonb)
            {
                Value = dto.prevState != null ? JsonSerializer.Serialize(dto.prevState) : DBNull.Value
            });

            cmd.Parameters.Add(new NpgsqlParameter("p_new_state", NpgsqlDbType.Jsonb)
            {
                Value = dto.newState != null ? JsonSerializer.Serialize(dto.newState) : DBNull.Value
            });

            cmd.Parameters.AddWithValue("p_action_result", dto.actionResult ?? "SUCCESS");

            if (!string.IsNullOrWhiteSpace(dto.ipAddress) && IPAddress.TryParse(dto.ipAddress, out var parsedIp))
            {
                cmd.Parameters.Add(new NpgsqlParameter("p_ip_address", NpgsqlDbType.Inet)
                {
                    Value = parsedIp
                });
            }
            else
            {
                cmd.Parameters.Add(new NpgsqlParameter("p_ip_address", NpgsqlDbType.Inet)
                {
                    Value = DBNull.Value
                });
            }

            cmd.Parameters.AddWithValue("p_user_agent", (object?)dto.userAgent ?? DBNull.Value);
            cmd.Parameters.AddWithValue("p_channel", (object?)dto.channel ?? DBNull.Value);

            // 🛠️ Serialize header to string before sending
        
            // ✅ Composite metadata parameter
            cmd.Parameters.AddWithValue("p_metadata", dto.metadata ?? (object)DBNull.Value);

            await cmd.ExecuteNonQueryAsync();
        }


        public async Task LogErrorAsync(ErrorLogDto dto)
        {
            using var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new NpgsqlCommand(
                "SELECT audit.log_application_error(@p_service_name, @p_module_name, @p_log_level, @p_message, @p_error_no, @p_request_method, @p_request_payload, @p_header)",
                conn
            );

            cmd.Parameters.AddWithValue("p_service_name", dto.ServiceName);
            cmd.Parameters.AddWithValue("p_module_name", (object?)dto.ModuleName ?? DBNull.Value);
            cmd.Parameters.AddWithValue("p_log_level", dto.LogLevel);
            cmd.Parameters.AddWithValue("p_message", dto.Message);
            cmd.Parameters.AddWithValue("p_error_no", (object?)dto.ErrorNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("p_request_method", (object?)dto.RequestMethod ?? DBNull.Value);
            cmd.Parameters.Add(new NpgsqlParameter("p_request_payload", NpgsqlDbType.Jsonb)
            {
                Value = dto.RequestPayload ?? (object)DBNull.Value
            });

            cmd.Parameters.Add(new NpgsqlParameter("p_header", NpgsqlDbType.Jsonb)
            {
                Value = dto.Header ?? (object)DBNull.Value
            });
            await cmd.ExecuteNonQueryAsync();
        }

    }
}
