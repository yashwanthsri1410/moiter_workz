using AuditTrailService.DTOs;
using AuditTrailService.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AuditTrailService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditController : ControllerBase
    {
        private readonly IAuditRepository _repository;

        public AuditController(IAuditRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("log-audit")]
        public async Task<IActionResult> LogAudit([FromBody] AuditLogDto dto)
        {
            await _repository.LogAuditAsync(dto);
            return Ok(new { message = "Audit log recorded." });
        }

        [HttpPost("log-error")]
        public async Task<IActionResult> LogError([FromBody] ErrorLogDto dto)
        {
            await _repository.LogErrorAsync(dto);
            return Ok(new { message = "Application error logged." });
        }
    }
}
