using AuditTrailService.DTOs;
using System.Threading.Tasks;

namespace AuditTrailService.Repository
{
    public interface IAuditRepository
    {
        Task LogAuditAsync(AuditLogDto dto);
        Task LogErrorAsync(ErrorLogDto dto);
    }
}
