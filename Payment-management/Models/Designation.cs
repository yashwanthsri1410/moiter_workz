using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models
{
    [Table("tbl_department", Schema = "user_management")]
    public class Designation
    {
        [Key]
        [Column("designation_id")]
        public int Id { get; set; }

        [Column("designation_name")]
        public string? DesignationName { get; set; }

        [Column("dept_id")]
        public int DeptId { get; set; }
    }
}
