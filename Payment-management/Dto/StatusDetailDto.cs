using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Dto
{
    public class StatusDetailDto
    {
        [Column("status_id")]
        public short StatusId { get; set; }

        [Column("status_description")]
        public string? StatusDescription { get; set; }
    }
}
