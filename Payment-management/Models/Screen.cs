using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models
{
    [PrimaryKey(nameof(ModuleId), nameof(ScreenId))]
    public class Screen
    {
        

        [Column("screen_id")]
        public int ScreenId { get; set; }

        [Column("screen_name")]
        public string? ScreenName { get; set; }
       
        [Column("module_id")]
        public int ModuleId { get; set; }
    }
}
