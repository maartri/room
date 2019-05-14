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
    public class CustomerController : Controller
    {
        private readonly DatabaseContext _context;
        // private IGeneralSetting GenSettings;

        public CustomerController(DatabaseContext context){
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostCustomer([FromBody] Customer customer){
            try
            {
                using(var db = _context)
                {
                    await db.AddAsync(customer);
                    await db.SaveChangesAsync();
                    return Ok(customer);
                }
            } catch(Exception ex)
            {
                return BadRequest(ex);
            }            
        }


        [HttpGet]
        public async Task<IActionResult> GetCustomer()
        {
            var customers = await _context.Customer.Select(x => x).ToListAsync();
            return Ok(customers);
        }

        [HttpDelete, Route("{number}")]
        public async Task<IActionResult> DeleteCustomer(int number){
            var customer = await _context.Customer.Where(x => x.CustomerId == number).Select(x => x).FirstOrDefaultAsync();
            if(customer == null)    return BadRequest();
            _context.Customer.Remove(customer);
            await _context.SaveChangesAsync();
            
            return Ok(true);
        }

        
    }
}
