namespace UserService.Models
{
    public class User
    {
        public string? Username { get; set; }
        public int Age { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int Usertype { get; set; } = 0;
        public string? Position { get; internal set; }
    }
}
