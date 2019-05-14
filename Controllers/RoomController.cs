
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Data.SqlClient;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

using Room.Models.Data;
using Room.Models;
using Room.Models.Dto;

namespace room.Controllers
{
    [Route("api/[controller]")]
    public class RoomController : Controller
    {
        private readonly DatabaseContext _context;
        // private IGeneralSetting GenSettings;

        public RoomController(DatabaseContext context){
            _context = context;
        }

        // [HttpPost]
        // public async Task<IActionResult> PostCustomer([FromBody] Customer customer){
        //     try
        //     {
        //         using(var db = _context)
        //         {
        //             await db.AddAsync(customer);
        //             await db.SaveChangesAsync();
        //             return Ok(customer);
        //         }
        //     } catch(Exception ex)
        //     {
        //         return BadRequest(ex);
        //     }            
        // }


        [HttpGet]
        public async Task<IActionResult> GetRoom()
        {
            using(var conn = _context.GetConnection())
            {
                using(SqlCommand cmd = new SqlCommand(@"SELECT RoomName, Size, Unit, FacilityName FROM Room r JOIN RoomCharacteristics rc
                    ON r.RoomId = rc.RoomId INNER JOIN Facility f ON rc.FacilityId = f.FacilityId",(SqlConnection) conn))
                    {
                        await conn.OpenAsync();
                        SqlDataReader rd = await cmd.ExecuteReaderAsync();
                        List<RoomCharacteristics> listRoomChar = new List<RoomCharacteristics>();
                        while(await rd.ReadAsync())
                        {
                            listRoomChar.Add(                            new RoomCharacteristics {
                                Room = new Rooms{
                                    RoomName = rd.GetString(0),
                                    Size = rd.GetInt32(1),
                                    Unit = rd.GetString(2)                             
                                },
                                Facility = new Facility {
                                    FacilityName = rd.GetString(3)
                                }
                            });
                        }
                        var rooms = listRoomChar.Select(x => x.Room.RoomName).Distinct();
                        List<KeyValuePair<string, object>> finalList = new List<KeyValuePair<string, object>>();
                        
                        foreach(var room in rooms)
                        {
                            var eachRoom = listRoomChar.Where(x => x.Room.RoomName == room).Select(x => x);
                            finalList.Add(new KeyValuePair<string, object>(room.Trim(), eachRoom));
                        }

                        return Ok(finalList);
                    }
            }            
        }

        [HttpPost("vacant")]
        public async Task<IActionResult> GetVacantRooms([FromBody] InputBooking booking){
            try
            {
                using(var conn = _context.GetConnection() as SqlConnection)
                {
                    using(SqlCommand cmd = new SqlCommand(@"SELECT r.RoomId, r.RoomName, r.Size, r.Unit, rc.Quantity, f.FacilityName FROM Room r 
                        INNER JOIN RoomCharacteristics rc 
                        ON r.RoomId = rc.RoomId INNER JOIN Facility f
                        ON f.FacilityId = rc.FacilityId 
                        WHERE r.RoomId NOT IN(
                            SELECT r.RoomId FROM Room r LEFT JOIN Booking b
                            ON r.RoomId = b.RoomId WHERE BookingDate = @BookDate AND EndTime > @StartTime AND StartTime < @EndTime
                        )",(SqlConnection) conn))
                    {
                        cmd.Parameters.AddWithValue("@BookDate", booking.BookDate);
                        cmd.Parameters.AddWithValue("@StartTime", booking.StartTime);
                        cmd.Parameters.AddWithValue("@EndTime", booking.EndTime);
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

                        List<Dictionary<string,object>> finalList = new List<Dictionary<string, object>>();
                        var rooms = list.Select(x => x["RoomName"]).Distinct();

                        foreach(string room in rooms)
                        {
                            var roomDetails = list.Where(x => x["RoomName"].ToString() == room).Select(x => x);

                            finalList.Add(new Dictionary<string, object>(){
                                { "RoomId", roomDetails.Select(x => x["RoomId"]).FirstOrDefault() },
                                { "RoomName", roomDetails.Select(x => x["RoomName"]).FirstOrDefault() },
                                { "Size", roomDetails.Select(x => x["Size"]).FirstOrDefault() },
                                { "Unit", roomDetails.Select(x => x["Unit"]).FirstOrDefault() },
                                { "Amenities", roomDetails.Select(x => new {
                                    FacilityName = x["FacilityName"],
                                    Quantity = x["Quantity"]
                                })},
                            });
                        }
                        return Ok(finalList);
                    }
                }
            } catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostRoom([FromBody] PostRoom room){
            try
            {
                int _RoomId = 0;
                using(var transaction = _context.Database.BeginTransaction())
                {
                    var _room = new Rooms { RoomName = room.RoomName, Size = room.Size, Unit = room.Unit };
                    _context.Room.Add(_room);
                    await _context.SaveChangesAsync();

                    _RoomId = _room.RoomId;

                    foreach(var amenity in room.Amenities)
                    {
                        var _amenity = await _context.Facility.AsNoTracking().Where(x => x.FacilityName == amenity.Name).Select(x => x).FirstOrDefaultAsync();

                        _context.RoomCharacteristics.Add(new RoomCharacteristics{
                            RoomId = _RoomId,
                            FacilityId = _amenity.FacilityId,
                            Quantity = amenity.Quantity
                        });

                        await _context.SaveChangesAsync();
                    }
                    transaction.Commit();
                    return Ok(true);
                }

            } catch(Exception ex)
            {
                return BadRequest(ex);
            }
            
        }

        
    }
}
