
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System.Data;
using UserService.Data;
using UserService.Dto;
using UserService.Dtos;
using UserService.Models;
using YourNamespace.Dtos;

namespace UserService.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserDbContext _context;
        private readonly IConfiguration _config;
        public UserRepository(UserDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;

        }
        public async Task<string> CreateSuperUserAsync(UserDto dto)
        {
            var sql = "SELECT user_management.super_user_creation_fn(@p_name, @p_age, @p_email, @p_password, @p_user_type)";

            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandText = sql;

            command.Parameters.Add(new NpgsqlParameter("p_name", dto.Name));
            command.Parameters.Add(new NpgsqlParameter("p_age", dto.Age));
            command.Parameters.Add(new NpgsqlParameter("p_email", dto.Email));
            command.Parameters.Add(new NpgsqlParameter("p_password", dto.Password));
            command.Parameters.Add(new NpgsqlParameter("p_user_type", dto.UserType));

            var result = await command.ExecuteScalarAsync();
            return result?.ToString() ?? "Unexpected error";
        }
        public async Task<SuperUserLoginResultDto?> LoginSuperUserAsync(UserLoginDto dto)
        {
            var sql = @"
    SELECT 
        user_id AS ""Id"",
        name AS ""Name"",
        age AS ""Age"",
        email AS ""Email"",
        user_type AS ""UserType""
    FROM user_management.tbl_super_users
    WHERE name = @p_name AND password = crypt(@p_password, password)";

            var parameters = new[]
            {
        new Npgsql.NpgsqlParameter("p_name", dto.Name),
        new Npgsql.NpgsqlParameter("p_password", dto.Password)
    };

            return await _context.Set<SuperUserLoginResultDto>()
                .FromSqlRaw(sql, parameters)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }


        public async Task<IEnumerable<UserTypeDto>> GetAllUserTypesAsync()
        {
            var userTypes = new List<UserTypeDto>();

            await using var conn = new NpgsqlConnection(_context.Database.GetConnectionString());
            await conn.OpenAsync();

            var cmd = new NpgsqlCommand(@"SELECT * FROM user_details()", conn);
            var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                userTypes.Add(new UserTypeDto
                {
                    Username = reader.GetString(0),
                    Age = reader.GetInt32(1),
                    UserTypeName = reader.GetString(2)
                });
            }

            return userTypes;
        }

        public async Task CallCreateDepartmentFunctionAsync(DepartmentDesignationDto dto)
        {
            var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT user_management.user_department_creations(@dept, @desig)";

            cmd.Parameters.Add(new NpgsqlParameter("@dept", dto.DeptName));
            cmd.Parameters.Add(new NpgsqlParameter("@desig", dto.DesignationName));

            await cmd.ExecuteNonQueryAsync();
            await conn.CloseAsync();
        }
        //public async Task<List<string>> GetAllDepartmentsAsync()
        //{
        //    return await _context.Departments.Select(d => d.Dept_Name).ToListAsync();
        //}
        public async Task<List<DepartmentDesignationDto>> GetAllDepartmentDesignationsAsync()
        {
            var result = await ((from d in _context.Designations
                                 join dept in _context.Departments on d.DeptId equals dept.Id
                                 select new DepartmentDesignationDto
                                 {
                                     DeptId = dept.Id,
                                     DeptName = dept.DeptName,
                                     DesignationId = d.Id,
                                     DesignationName = d.DesignationName
                                 })
                                ).ToListAsync();

            return result;
        }

        public async Task DeleteDepartmentAsync(string deptName)
        {
            var sql = @"DELETE FROM user_management.""tbl_Department""
                WHERE dept_name = @dept";

            var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = sql;
            cmd.Parameters.Add(new NpgsqlParameter("@dept", deptName));
            await cmd.ExecuteNonQueryAsync();

            await conn.CloseAsync();
        }


        public async Task DeleteDesignationAsync(string designationName)
        {
            var sql = @"DELETE FROM user_management.""tbl_Designation""
            WHERE designation_desc = @designation";

            var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = sql;
            cmd.Parameters.Add(new NpgsqlParameter("@designation", designationName));
            await cmd.ExecuteNonQueryAsync();

            await conn.CloseAsync();
        }
        // Repository/UserRepository.cs
        public async Task CallCreateModuleScreenFunctionAsync(ModuleWithScreensDto dto)
        {
            var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT user_management.add_module_with_screens(@modul, @screen, @desId)";

            cmd.Parameters.Add(new NpgsqlParameter("@modul", dto.ModuleDescription));
            cmd.Parameters.Add(new NpgsqlParameter("@screen", dto.ScreenDesc));
            cmd.Parameters.Add(new NpgsqlParameter("@desId", dto.DesignationId));

            await cmd.ExecuteNonQueryAsync();
            await conn.CloseAsync();
        }
        public async Task<CombinedDetailsDto> GetAllCombinedDetailsAsync()
        {
            var statusDetails = await _context.StatusDetailDtos
                .FromSqlRaw("SELECT * FROM user_management.status_details()")
                .ToListAsync();

            var moduleDetails = await _context.ModuleDetailDtos
                .FromSqlRaw("SELECT * FROM user_management.module_details()")
                .ToListAsync();

            var departmentDesignations = await (from d in _context.Designations
                                                join dept in _context.Departments on d.DeptId equals dept.Id
                                                select new DepartmentDesignationDto
                                                {
                                                    DeptId = dept.Id,
                                                    DeptName = dept.DeptName,
                                                    DesignationId = d.Id,
                                                    DesignationName = d.DesignationName
                                                }).ToListAsync();

            return new CombinedDetailsDto
            {
                StatusDetails = statusDetails,
                ModuleDetails = moduleDetails,
                DepartmentDesignations = departmentDesignations
            };
        }

        public async Task<string> CreateUserAsync(UserCreationDto userDto)
        {
            var result = await _context.UserCreationResponses
          .FromSqlInterpolated($@"
        SELECT user_management.user_creation_fn(
            {userDto.EmpId},
            {userDto.DeptId},
            {userDto.DesignationId},
            {userDto.Name},
            {userDto.Email},
            {userDto.Password},
            {userDto.StatusId},
            {userDto.ModuleAccessId},
            {userDto.CreatedBy},
            {userDto.UserType}
        ) AS ""Response""")
    .AsNoTracking()
    .FirstOrDefaultAsync();

            return result?.Response ?? "❌ Failed to create user.";
        }

        public async Task<string> CheckUserLoginAsync(employeeLoginDto dto)
        {
            string result;

            var commandText = "SELECT user_management.user_password_check(@username::text, @password::text)";

            using (var conn = new NpgsqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await conn.OpenAsync();

                using (var cmd = new NpgsqlCommand(commandText, conn))
                {
                    cmd.Parameters.AddWithValue("username", NpgsqlTypes.NpgsqlDbType.Text, dto.Name);
                    cmd.Parameters.AddWithValue("password", NpgsqlTypes.NpgsqlDbType.Text, dto.Password);

                    var scalar = await cmd.ExecuteScalarAsync();
                    result = scalar?.ToString();
                }
            }

            return result;
        }
        public ClientInfoDto GetClientInfo(HttpRequest request, ConnectionInfo connection)
        {
            var headers = new Dictionary<string, string>();
            foreach (var header in request.Headers)
            {
                headers[header.Key] = header.Value;
            }

            var userAgent = request.Headers["User-Agent"].ToString();
            var deviceType = userAgent.Contains("Mobile", StringComparison.OrdinalIgnoreCase) ? "Mobile" : "Desktop";
            var protocol = request.Protocol;
            var ip = connection.RemoteIpAddress?.ToString();

            // Call external API to get IP location
            string location = "Unknown", isp = "Unknown";
            try
            {
                using var client = new HttpClient();
                var response = client.GetStringAsync("https://ipinfo.io/json").Result;
                dynamic geo = Newtonsoft.Json.JsonConvert.DeserializeObject(response);
                location = geo.city + ", " + geo.region;
                isp = geo.org;
            }
            catch
            {
                // Ignore if fails
            }

            return new ClientInfoDto
            {
                Headers = headers,
                DeviceType = deviceType,
                Protocol = protocol,
                Network = ip,
                Location = location,
                ISP = isp
            };
        }
        public async Task InsertAuditTrailAsync(AuditTrailDto dto)
        {
            var connString = _config.GetConnectionString("DefaultConnection");
            var validActions = new[] { "INSERT", "UPDATE", "DELETE" };
            dto.Action = dto.Action?.ToUpperInvariant();

            if (!validActions.Contains(dto.Action))
            {
                throw new ArgumentException(
                    $"Invalid audit action: '{dto.Action}'. Allowed values: INSERT, UPDATE, DELETE.");
            }

            await using var conn = new NpgsqlConnection(connString);
            await conn.OpenAsync();

            var sql = "SELECT user_management.insert_audit_trail(" +
                      "@p_entity_name, @p_entity_id, @p_action, @p_changed_by, " +
                      "@p_changed_on, @p_old_values, @p_new_values, @p_changed_columns, @p_source_ip)";

            await using var cmd = new NpgsqlCommand(sql, conn)
            {
                CommandType = CommandType.Text // 🔧 use CommandType.Text for SELECT
            };

            cmd.Parameters.AddWithValue("p_entity_name", dto.EntityName);
            cmd.Parameters.AddWithValue("p_entity_id", dto.EntityId ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("p_action", dto.Action);
            cmd.Parameters.AddWithValue("p_changed_by", dto.ChangedBy ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("p_changed_on", dto.ChangedOn);
            cmd.Parameters.AddWithValue("p_old_values", dto.OldValues ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("p_new_values", dto.NewValues ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("p_changed_columns", dto.ChangedColumns ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("p_source_ip", dto.SourceIP ?? (object)DBNull.Value);

            await cmd.ExecuteNonQueryAsync(); // 🔧 works even if the function returns void
        }
    }
}
   









