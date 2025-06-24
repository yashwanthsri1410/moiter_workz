using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models
{
    public class Module
    {
        
        [Column("module_id")]
        public int ModuleId { get; set; }

        [Column("module_name")]
        public string? ModuleName { get; set; }
    }
}
