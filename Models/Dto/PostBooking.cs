using System;
using Room.Models.Data;
using System.Collections.Generic;

namespace Room.Models.Dto{
    public class PostBooking
    {
        public InputBooking DateTimeDetails { get; set; }
        public Customer Customer { get; set; }
        public Rooms Room { get; set; }
        public List<PostAddOn> Addons { get; set; }
    }

}