using UserService.Dtos;

namespace UserService.Dto
{
    public class CombinedDetailsDto
    {
        public List<StatusDetailDto>? StatusDetails { get; set; }
        public List<ModuleWithScreensDto>? ModuleDetails { get; set; }
        public List<DepartmentDesignationDto>? DepartmentDesignations { get; set; }
    }
}
