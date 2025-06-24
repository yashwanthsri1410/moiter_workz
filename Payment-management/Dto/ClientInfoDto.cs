public class ClientInfoDto
{
    public Dictionary<string, string> Headers { get; set; } = new();
    public string? DeviceType { get; set; }
    public string? Location { get; set; } // Placeholder
    public string? Network { get; set; }  // IP Address
    public string? ISP { get; set; }      // Placeholder
    public string? Protocol { get; set; }
}
