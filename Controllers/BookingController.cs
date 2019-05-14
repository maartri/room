using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;

using Room.Models.Data;
using Room.Models.Dto;
using Room.Models;

namespace room.Controllers
{
    [Route("api/[controller]")]
    public class BookingController : Controller
    {
        private readonly DatabaseContext _context;
        // private IGeneralSetting GenSettings;

        public BookingController(DatabaseContext context){
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooking()
        {
            using(var conn = _context.Database.GetDbConnection() as SqlConnection)
            {
                using(SqlCommand cmd = new SqlCommand(@"SELECT BookingId,BookingDate, StartTime, EndTime, r.RoomName, CONCAT(c.CustomerFirstName,' ', c.CustomerLastName) as Name FROM Booking b 
                    INNER JOIN Room r ON r.RoomId = b.RoomId
                    INNER JOIN Customer c ON c.CustomerId = b.CustomerId",(SqlConnection) conn)){
                        await conn.OpenAsync();
                        SqlDataReader rd = await cmd.ExecuteReaderAsync();

                        List<Dictionary<string, object>> list =  new List<Dictionary<string, object>>();
                        int numCol = rd.FieldCount;

                        while(await rd.ReadAsync())
                        {

                            Dictionary<string, dynamic> dic = new Dictionary<string, dynamic>();       

                            // LOOP COLUMNS IN ROW
                            for (var a = 0; a < numCol; a++){
                                dic.Add(rd.GetName(a).Replace(" ", ""), rd.GetValue(a) != DBNull.Value 
                                    ? rd.GetValue(a) 
                                    : "");
                            }
                            list.Add(dic);
                        }
                        return Ok(list);
                    }
            }
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<IActionResult> GetSpecificBooking(int bookingId){
            using(var conn = _context.Database.GetDbConnection() as SqlConnection)
            {
                List<dynamic> listFac = new List<dynamic>();
                List<dynamic> listAdd = new List<dynamic>();
                dynamic bookDetails = null;

                await conn.OpenAsync();

                using(SqlCommand cmd = new SqlCommand(@"select BookingDate, StartTime, EndTime from booking Where bookingid = @id",(SqlConnection) conn)){
                      cmd.Parameters.AddWithValue("@id", bookingId);                  
 
                    //SqlDataReader rd = await cmd.ExecuteReaderAsync();
                    using(var rd = await cmd.ExecuteReaderAsync()){
                        while(await rd.ReadAsync())
                        {
                            bookDetails = new {
                                BookingDate = rd.GetDateTime(0),
                                StartTime = rd.GetDateTime(1),
                                EndTime = rd.GetDateTime(2),
                            };
                        }  
                    }
                }

                using(SqlCommand cmd = new SqlCommand(@"SELECT r.RoomId, f.FacilityName FROM Room r 
                    INNER JOIN RoomCharacteristics rc ON rc.RoomId = r.RoomId
                    INNER JOIN Facility f ON f.FacilityId = rc.FacilityId WHERE r.RoomId IN (
                        Select b.RoomId from booking b WHERE BookingId = @id
                    )",(SqlConnection) conn)){
                    cmd.Parameters.AddWithValue("@id", bookingId);                  
 
                    //SqlDataReader rd = await cmd.ExecuteReaderAsync();
                    using(var rd = await cmd.ExecuteReaderAsync()){
                        while(await rd.ReadAsync())
                        {
                            listFac.Add(new {
                                RoomId = rd.GetInt32(0),
                                FacilityName = rd.GetString(1)
                            });
                        }  
                    }
                                      
                }

                using(SqlCommand cmd = new SqlCommand(@"SELECT ba.Quantity, a.AddOnName FROM BookingAddOn ba INNER JOIN AddOn a ON a.AddOnId = ba.AddOnId  WHERE ba.BookingId = @id",(SqlConnection) conn)){
                    cmd.Parameters.AddWithValue("@id", bookingId);         
              
                    //SqlDataReader rd = await cmd.ExecuteReaderAsync();
                     using(var rd = await cmd.ExecuteReaderAsync()){
                        while(await rd.ReadAsync())
                        {
                            listAdd.Add(new {
                                Quantity = rd.GetInt16(0),
                                AddOnName = rd.GetString(1)
                            });
                        }   
                     }
                   
                }

                return Ok(new {
                    Facilties= listFac,
                    Addons = listAdd,
                    BookDetails= bookDetails
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostBookingDetails([FromBody] PostBooking booking){
          
            using(var conn = _context.Database.GetDbConnection() as SqlConnection)
            {
                SqlTransaction transaction = null;                
                try
                {
                    await conn.OpenAsync();
                    transaction = conn.BeginTransaction();
                    int insertedRow = -1;
                    using(SqlCommand cmd = new SqlCommand(@"INSERT INTO Booking(BookingDate,StartTime,EndTime,RoomId,CustomerId) VALUES(@BookingDate,@StartTime,@EndTime,@RoomId,@CustomerId);SELECT SCOPE_IDENTITY();",(SqlConnection) conn, transaction))
                    {
                        cmd.Parameters.AddWithValue("@BookingDate", booking.DateTimeDetails.BookDate);
                        cmd.Parameters.AddWithValue("@StartTime", booking.DateTimeDetails.StartTime);
                        cmd.Parameters.AddWithValue("@EndTime", booking.DateTimeDetails.EndTime);
                        cmd.Parameters.AddWithValue("@RoomId", booking.Room.RoomId);
                        cmd.Parameters.AddWithValue("@CustomerId", booking.Customer.CustomerId);

                        var modified = await cmd.ExecuteScalarAsync();
                        insertedRow = Convert.ToInt32(modified);
                    }

                    foreach(var addons in booking.Addons){
                        using(SqlCommand cmd = new SqlCommand(@"INSERT INTO BookingAddOn(BookingId,AddOnId,Quantity) VALUES(@BookingId,@AddOnId,@Quantity)",(SqlConnection) conn, transaction))
                        {
                            cmd.Parameters.AddWithValue("@BookingId", insertedRow);
                            cmd.Parameters.AddWithValue("@AddOnId", addons.AddOnId);
                            cmd.Parameters.AddWithValue("@Quantity", addons.Quantity);

                            await cmd.ExecuteNonQueryAsync();
                        }
                    }
                    transaction.Commit();
                    return Ok(booking);
                }
                catch(Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest(ex);
                } 
            }
            
        }



        

        
    }
}
