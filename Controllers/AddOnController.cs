
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
    public class AddOnController : Controller
    {
        private readonly DatabaseContext _context;
        // private IGeneralSetting GenSettings;

        public AddOnController(DatabaseContext context){
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


        [HttpPost]
        public async Task<IActionResult> PostAddOn([FromBody] AddOn addon)
        {
            try
            {
                using(var db = _context)
                {
                    await db.AddAsync(addon);
                    await db.SaveChangesAsync();
                    return Ok(true);
                }
            } catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAddon(){
            var addon = await _context.AddOn.Select(x => x).ToListAsync();
            return Ok(addon);
        }

        

        
    }
}
