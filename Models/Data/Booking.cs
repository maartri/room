using System;
using System.ComponentModel.DataAnnotations;


namespace Room.Models.Data{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int RoomId { get; set; }
        public int CustomerId { get; set; }

    }
}