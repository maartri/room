using System.ComponentModel.DataAnnotations;

namespace Room.Models.Data{
    public class AddOn
    {
        [Key]
        public int AddOnId { get; set; }
        public string AddOnName { get; set; }
        public string Description { get; set; }
    }
}