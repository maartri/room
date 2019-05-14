import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild, Inject } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';

import { CustomerService } from '../../services/customer.service'
import * as moment from 'moment';

import { FullCalendarComponent } from '@fullcalendar/angular';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { DialogComponent } from '../../shared/dialog/dialog.component'



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  entryComponents: [DialogComponent]
})
export class AdminComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarPlugins = [dayGridPlugin]; // important!
  bookings: Array<any> = [];
  show:boolean = false;

  events: Array<any> = []

  facilities: Array<any>;
  addons: string;

  constructor(
    private custS: CustomerService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.custS.getBookingDetails()
    .subscribe(data => {
      var index = 0;
      this.events = data.map(x => {
        return {
          title: `${x.RoomName} | ${x.Name}`,
          //date: '2019-05-17'
          id: x.BookingId,
          date: moment(x.StartTime).format('YYYY-MM-DD HH:mm:ss')
         
        }
      })
      this.show = true;
    })
  }

  handleDateClick(event: any){
   
   

    this.custS.getSpecificBooking(event.event.id)
              .subscribe(data => {

                var sample = data.bookDetails;
                sample.bookingDate = moment(sample.bookingDate).format('MMMM DD,YYYY')
                sample.startTime = moment(sample.startTime).format('HH:mm')
                sample.endTime = moment(sample.endTime).format('HH:mm')
 
                const dialogRef = this.dialog.open(DialogComponent, {
                  width: '600px',
                  data: {facilities: data.facilties, addons: data.addons, name: event.event.title.split('|')[1], bookDetails: sample }
                  
                });
            
                dialogRef.afterClosed().subscribe(result => {
                  console.log('The dialog was closed');
                  //this.animal = result;
                });
              })

  }

}


