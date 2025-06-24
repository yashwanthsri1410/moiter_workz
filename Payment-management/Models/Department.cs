using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models
{
    [Table("tbl_department", Schema = "user_management")]
    public class Department
    {
        [Key]
        [Column("dept_id")]
        public int Id { get; set; }

        [Column("dept_name")]
        public string? DeptName { get; set; }
    }
}
        