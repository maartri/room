using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.Extensions.Configuration;

using Room.Models.Data;

namespace Room.Models{
    public class DatabaseContext: DbContext
    {
        private readonly IConfiguration _config;
        public DatabaseContext(IConfiguration config,DbContextOptions<DatabaseContext> options)
            :base(options){ 
                this._config = config;
            }

        public SqlConnection GetConnection(){
            return new SqlConnection(this._config["ConnectionStrings:Production"]);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BookingAddOn>()
                .HasKey(o => new { o.AddOnId, o.BookingId});

            modelBuilder.Entity<RoomCharacteristics>()
                .HasKey(o => new { o.FacilityId, o.RoomId});
        }

        public DbSet<AddOn> AddOn { get; set; }
        public DbSet<Booking> Booking { get; set; }
        public DbSet<BookingAddOn> BookingAddOn { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<Facility> Facility { get; set; }
        public DbSet<Rooms> Room { get; set; }
        public DbSet<RoomCharacteristics> RoomCharacteristics { get; set; }


    }
}