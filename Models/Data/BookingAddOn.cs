using System.ComponentModel.DataAnnotations;
using Room.Models.Data;

namespace Room.Models.Data{
    public class BookingAddOn
    {
        public AddOn AddOn { get; set; }
        public Booking Booking { get; set; }
        [Key]
        public int AddOnId { get; set; }
        [Key]
        public int BookingId { get; set; }
        public int Quantity { get; set; }

    }
}