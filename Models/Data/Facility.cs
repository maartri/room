
using System.ComponentModel.DataAnnotations;

namespace Room.Models.Data{
    public class Facility
    {
        [Key]
        public int FacilityId { get; set; }
        public string FacilityName { get; set; }

    }
}