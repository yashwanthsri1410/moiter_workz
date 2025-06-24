namespace UserService.Dto
{
    public class UserCreationDto
    {
        public string EmpId { get; set; } = string.Empty;
        public int DeptId { get; set; }
        public int DesignationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int StatusId { get; set; }
        public int ModuleAccessId { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public int UserType { get; set; }
    }
}
