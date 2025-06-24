using System.Text.Json;

namespace AuditTrailService.DTOs
{
    public class ErrorLogDto
    {
        public string ServiceName { get; set; }
        public string ModuleName { get; set; }
        public string LogLevel { get; set; }
        public string Message { get; set; }
        public string ErrorNo { get; set; }
        public string RequestMethod { get; set; }
        public JsonElement? RequestPayload { get; set; }
        public JsonElement? Header { get; set; }         // JSON
    }
}
