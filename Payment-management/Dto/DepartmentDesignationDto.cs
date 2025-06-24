namespace UserService.Dtos
{
    public class DepartmentDesignationDto
    {
        public int DeptId { get; set; }
        public string DeptName { get; set; } = string.Empty;
        public int DesignationId { get; set; }
        public string DesignationName { get; set; } = string.Empty;
    }
}
