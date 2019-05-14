using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Room.Models.Dto{
    public class PostRoom
    {
        public string RoomName { get; set; }
        public int Size { get; set; }
        public string Unit { get; set; }
        public List<Amenities> Amenities { get; set; }
    }

    public class Amenities {
        public string Name { get; set; }
        public int Quantity { get; set; }
    }
}