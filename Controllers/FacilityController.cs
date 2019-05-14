using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Room.Models.Data;
using Room.Models;

namespace room.Controllers
{
    [Route("api/[controller]")]
    public class FacilityController : Controller
    {
        private readonly DatabaseContext _context;
        // private IGeneralSetting GenSettings;

        public FacilityController(DatabaseContext context){
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetFacility()
        {
            var customers = await _context.Facility.Select(x => x).ToListAsync();
            return Ok(customers);
        }

        [HttpPost]
        public async Task<IActionResult> PostFacility([FromBody] Facility facility){
            try
            {
                using(var db = _context)
                {
                    await db.AddAsync(facility);
                    await db.SaveChangesAsync();
                    return Ok(true);
                }
            } catch(Exception ex)
            {
                return BadRequest(ex);
            }            
        }

        [HttpDelete, Route("{number}")]
        public async Task<IActionResult> DeleteCustomer(int number){
            var facility = await _context.Facility.Where(x => x.FacilityId == number).Select(x => x).FirstOrDefaultAsync();
            if(facility == null)    return BadRequest();
            
            _context.Facility.Remove(facility);
            await _context.SaveChangesAsync();
            
            return Ok(true);
        }


        

        
    }
}
