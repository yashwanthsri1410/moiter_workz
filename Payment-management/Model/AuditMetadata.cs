using System.Text.Json;

namespace AuditTrailService.Model
{
    public class AuditMetadata
    {
        public Guid? created_by { get; set; }
        public DateTime? created_date { get; set; }
        public Guid? modified_by { get; set; }
        public DateTime? modified_date { get; set; }

        public JsonDocument? header { get; set; } // ← accepts nested JSON object
    }

}
