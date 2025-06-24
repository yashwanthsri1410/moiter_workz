using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models
{
    [Table("tbl_super_users", Schema = "user_management")]
    public class SuperUser
    {
        [Key]
        [Column("user_id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("age")]
        public int Age { get; set; }

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("user_type")]
        public int UserType { get; set; }
    }
}
