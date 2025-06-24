// Controllers/DepartmentController.cs
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UserService.Dto;
using UserService.Dtos;
using UserService.Repository;
using YourNamespace.Dtos;

namespace UserService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly IUserRepository _repo;

        public DepartmentController(IUserRepository repo)
        {
            _repo = repo;
        }
        [HttpPost("create-super-user")]
        public async Task<IActionResult> CreateSuperUser([FromBody] UserDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var response = await _repo.CreateSuperUserAsync(dto);
            return Ok(new { message = response });
        }
        [HttpPost("super-user-login")]
        public async Task<IActionResult> SuperUserLogin( UserLoginDto dto)
        {
            var user = await _repo.LoginSuperUserAsync(dto);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            // Optional: Add JWT token generation here

            return Ok(new
            {
                message = "Login successful",
                user = user
            });
        }

        [HttpGet("usertypes")]
        public async Task<IActionResult> GetAllUserTypes()
        {
            try
            {
                var userTypes = await _repo.GetAllUserTypesAsync();
                return Ok(userTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }


        [HttpPost("create")]
        public async Task<IActionResult> CreateDepartment([FromBody] DepartmentDesignationDto  dto)
        {
            await _repo.CallCreateDepartmentFunctionAsync(dto);
            return Ok("Department and Designation created");
        }
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            try
            {
                var departments = await _repo.GetAllDepartmentDesignationsAsync();
                return Ok(departments);
            }
            catch (Exception ex)
            {
                // This reveals the internal error in the API response
                return StatusCode(500, $"🔥 Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("department/{deptName}")]
        public async Task<IActionResult> DeleteDepartment(string deptName)
        {
            try
            {
                await _repo.DeleteDepartmentAsync(deptName);
                return Ok(new { message = "Department deleted successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpDelete("designation/{designationName}")]
        public async Task<IActionResult> DeleteDesignation(string designationName)
        {
            await _repo.DeleteDesignationAsync(designationName);
            return Ok("Designation deleted");
        }
       
        [HttpPost("Module")]
        public async Task<IActionResult> CreateModule([FromBody] ModuleWithScreensDto dto)
        {
            await _repo.CallCreateModuleScreenFunctionAsync(dto);
            return Ok("module desc and screen desc  created");
        }
        [HttpGet("get-all-details")]
        [ProducesResponseType(typeof(CombinedResponseDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllCombinedDetails()
        {
            var result = await _repo.GetAllCombinedDetailsAsync();
            var headers = new Dictionary<string, string>();

            foreach (var header in Request.Headers)
            {
                headers[header.Key] = header.Value;
            }

            var response = new
            {
                Headers = headers,
                Data = result
            };

            return Ok(response);
        }

        [HttpPost("userCreate")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreationDto userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _repo.CreateUserAsync(userDto);
            return Ok(new { message = result });
        }
        [HttpPost("Employeelogin")]
        public async Task<IActionResult> Login([FromBody] employeeLoginDto dto)
        {
            var jsonString = await _repo.CheckUserLoginAsync(dto);

            if (string.IsNullOrEmpty(jsonString))
                return StatusCode(500, new { message = "Empty response from DB" });

            var jsonData = JObject.Parse(jsonString);
            string? message = jsonData["message"]?.ToString();

            if (message != null && message.Contains("✅"))
                return Ok(jsonData);

            return Unauthorized(jsonData);
        }

        [HttpGet("get-request-info")]
        public IActionResult GetClientInfo()
        {
            var info = _repo.GetClientInfo(Request, HttpContext.Connection);

            return Ok(info);
        }
        [HttpPost("log")]
        public async Task<IActionResult> InsertAuditTrail([FromBody] AuditTrailDto dto)
        {
            if (string.IsNullOrEmpty(dto.EntityName) || string.IsNullOrEmpty(dto.Action))
                return BadRequest("Entity name and action are required.");

            dto.ChangedOn = DateTime.UtcNow;

            await _repo.InsertAuditTrailAsync(dto);
            return Ok("Audit log inserted.");
        }
    }
}


 
