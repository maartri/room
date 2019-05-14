import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { CustomerService } from '../../services/customer.service'
import * as moment from 'moment';
import { MatStepper } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  bookingGroup: FormGroup;
  roomGroup: FormGroup;
  addOnGroup: FormGroup;

  isOptional = false;

  foods: Array<any>;
  rooms: Array<any>;
  addons: Array<any>;
  employees: Array<any>;

  panelOpenState = false;

  constructor(
    private _formBuilder: FormBuilder,
    private custS: CustomerService,
    private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.custS.getRoom()
        .subscribe(data => this.foods = data)
    
      this.reset();

 
      this.getAddons();
      this.getEmployee();
  }

  reset(){
    this.bookingGroup = this._formBuilder.group({
      // bookDate: ['', Validators.required],
      // startTime:  ['', Validators.required],
      // endTime:  ['', Validators.required],
      bookDate: [moment().format('YYYY-MM-DD')],
      startTime:  [''],
      endTime:  [''],
      employee: ['']
    });

    this.roomGroup = this._formBuilder.group({
      room: ['']
    });

    this.addOnGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
  }

  getEmployee(){
    this.custS.getCustomer()
        .subscribe(data => {
          this.employees = data
        })
  }

  getAddons(){    
    this.custS.getAddOn()
    .subscribe(data => {
      this.addons = data.map(x => {
        return {
          addOnId: x.addOnId,
          addOnName: x.addOnName,
          description: x.description,
          quantity: 0
        }
      });
    })

  }

  goNext(){
    
    const date = this.bookingGroup.value;
    const _bookDate = moment(date.bookDate).format('YYYY-MM-DD');

    const inputs = {
      bookDate: _bookDate,
      startTime: moment(date.startTime,['HH:mm a']).format(`${ _bookDate } HH:mm:ss`),
      endTime: moment(date.endTime,['HH:mm a']).format(`${ _bookDate } HH:mm:ss`)
    }   
    
    this.custS.getVacantRooms(inputs)
        .subscribe(data => this.rooms = data  )
  }


  nextPage(stepper: MatStepper, room: any){
  

    this.roomGroup.patchValue({
      room: room
    })
    stepper.next();
  }

  ver(){
    console.log(this.addons)
  }

  book(stepper: MatStepper){

    const { bookDate, startTime, endTime, employee } = this.bookingGroup.value;

    const { RoomId, RoomName, Size, Unit } = this.roomGroup.value.room;

    const _bookDate = moment(bookDate).format('YYYY-MM-DD');
    const booking = {
      BookDate: _bookDate,
      StartTime: moment(startTime,['HH:mm a']).format(`${ _bookDate } HH:mm:ss`),
      EndTime: moment(endTime,['HH:mm a']).format(`${ _bookDate } HH:mm:ss`)
    }

    const room  = {
      RoomId: RoomId,
      RoomName: RoomName,
      Size: Size,
      Unit: Unit
    }

    const customer = {
      CustomerId: employee.customerId,
      CustomerFirstName: employee.customerFirstName,
      CustomerLastName: employee.customerLastName
    }

    const addons = this.addons.filter(x => {
      if(x.quantity > 0)
        return x;
    });

    var inputs = {
      DateTimeDetails: booking,
      Customer: customer,
      Room: room,
      AddOns: addons
    }

    console.log(inputs)

    this.custS.postBookingDetails(inputs)
        .subscribe(data => {
          if(data){
            this.toastr.success('Booked', 'Success');
            this.getAddons();
            stepper.reset()
            this.reset();
          }
        })
   
   
    
  }

  getCompleteName(name: any){ 
    return `${ name.customerFirstName } ${name.customerLastName}`;
  }

  displayFn(user?: any): string | undefined {
    return user ? `${user.customerFirstName} ${user.customerLastName}` : undefined;
  }

  size(){
    return `${this.roomGroup.value.room.Size} sq. ${this.roomGroup.value.room.Unit}`
  }



}
