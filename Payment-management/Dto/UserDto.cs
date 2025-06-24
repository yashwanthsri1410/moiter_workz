namespace UserService.Dto
{
    public class UserDto
    {
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int UserType { get; set; }

    }
}
