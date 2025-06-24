using AuditTrailService.DTOs;
using AuditTrailService.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AuditTrailService.Middleware
{
    public class ErrorLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorLoggingMiddleware> _logger;

        public ErrorLoggingMiddleware(RequestDelegate next, ILogger<ErrorLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IAuditRepository auditRepo)
        {
            try
            {
                // Clone request for reading
                context.Request.EnableBuffering();
                var requestBody = await new StreamReader(context.Request.Body).ReadToEndAsync();
                context.Request.Body.Position = 0;

                await _next(context); // Pass to next middleware
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled Exception");

                // Extract request body again
                context.Request.EnableBuffering();
                var requestBody = await new StreamReader(context.Request.Body).ReadToEndAsync();
                context.Request.Body.Position = 0;

                var headers = JsonSerializer.Serialize(context.Request.Headers);

                var errorLog = new ErrorLogDto
                {
                    ServiceName = "AuditTrailService",
                    ModuleName = context.GetEndpoint()?.DisplayName ?? "Unknown",
                    LogLevel = "ERROR",
                    Message = ex.Message,
                    ErrorNo = "500",
                    RequestMethod = context.Request.Method,
                    RequestPayload = JsonSerializer.Deserialize<JsonElement>(requestBody), 
                    Header = JsonSerializer.Deserialize<JsonElement>(headers)
                };

                await auditRepo.LogErrorAsync(errorLog);

                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("Internal server error logged.");
            }
        }
    }
}
