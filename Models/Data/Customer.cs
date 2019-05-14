using System.ComponentModel.DataAnnotations;

namespace Room.Models.Data{
    public class Customer
    {   
        [Key]
        public int CustomerId { get; set; }
        public string CustomerFirstName { get; set; }
        public string CustomerLastName { get; set; }

    }
}