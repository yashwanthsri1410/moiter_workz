using AuditTrailService.Model;
using AuditTrailService.Models;
using AuditTrailService.Repository;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// ? Register composite type globally (must be before app.Build())
NpgsqlConnection.GlobalTypeMapper.MapComposite<AuditMetadata>("audit.audit_metadata");

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register your repository
builder.Services.AddScoped<IAuditRepository, AuditRepository>();
builder.Services.AddScoped<IAuditCommandFactory, AuditCommandFactory>();


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.MapControllers();
app.Run();
