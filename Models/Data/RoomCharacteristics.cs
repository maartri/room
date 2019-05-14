
using Room.Models.Data;
using System.ComponentModel.DataAnnotations;


namespace Room.Models.Data{
    public class RoomCharacteristics
    {
        public Rooms Room { get; set; }
        public Facility Facility { get; set; }

        [Key]
        public int RoomId { get; set; }
        
        [Key]
        public int FacilityId { get; set; }
        public int Quantity { get; set; }

    }
}