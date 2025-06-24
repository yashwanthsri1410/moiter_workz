namespace UserService.Dto
{
    public class UserLoginResponseDto
    {
        public string Username { get; set; } = null!;

        public string? Email { get; set; }
        public int UserType { get; set; }
        public string? Position { get; set; }
    }
}

