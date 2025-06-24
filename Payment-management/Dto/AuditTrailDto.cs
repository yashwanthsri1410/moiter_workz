namespace YourNamespace.Dtos
{
    public class AuditTrailDto
    {
        public string? EntityName { get; set; }
        public string? EntityId { get; set; }
        public string? Action { get; set; }
        public string? ChangedBy { get; set; }
        public DateTime ChangedOn { get; set; } = DateTime.UtcNow;
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string? ChangedColumns { get; set; }
        public string? SourceIP { get; set; }
    }
}
