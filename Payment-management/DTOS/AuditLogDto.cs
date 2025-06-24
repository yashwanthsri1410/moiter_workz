using AuditTrailService.Model;

namespace AuditTrailService.DTOs
{
    public class AuditLogDto
    {
        public Guid actorId { get; set; }
        public string actorType { get; set; } = null!;
        public string? actorRole { get; set; }
        public string action { get; set; } = null!;
        public string entityType { get; set; } = null!;
        public Guid? entityId { get; set; }

        public object? prevState { get; set; }
        public object? newState { get; set; }

        public string? actionResult { get; set; } = "SUCCESS";
        public string? ipAddress { get; set; }
        public string? userAgent { get; set; }
        public string? channel { get; set; }

        public AuditMetadata? metadata { get; set; }
    }
}


