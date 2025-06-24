using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Dto
{
    public class ModuleWithScreensDto
    {
        [Column("module_id")]
        public short ModuleId { get; set; }

        [Column("module_description")]
        public string ModuleDescription { get; set; } = string.Empty;

        [Column("screen_id")]
        public short ScreenId { get; set; }

        [Column("screen_desc")]
        public string? ScreenDesc { get; set; }

        [Column("module_access")]
        public short ModuleAccess { get; set; }

        [Column("designation_id")]
        public int DesignationId { get; set; }  // ✅ PascalCase property with correct Column mapping
    }
}
