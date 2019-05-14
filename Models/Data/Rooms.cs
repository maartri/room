using System.ComponentModel.DataAnnotations;

namespace Room.Models.Data{
    public class Rooms
    {
        [Key]
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public int Size { get; set; }
        public string Unit { get; set; }

    }
}