import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { CustomerService } from '../../services/customer.service'
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  addRoomForm: FormGroup;
  addOnForm: FormGroup;
  addFacilityForm: FormGroup;

  facilities: Array<any>;

  lists: FormArray

  constructor(
    private formBuilder: FormBuilder,
    private custS: CustomerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.custS.getRoom()
        .subscribe(data => {
          console.log(data)
        })

    this.addRoomForm = this.formBuilder.group({
      RoomName: ['', Validators.required],
      Size: [''],
      Unit: [''],
      Amenities: this.formBuilder.array([this.createAmenity()])
    })

    this.addOnForm = this.formBuilder.group({
      AddOnId: 0,
      AddOnName: ['', Validators.required],
      Description: ['']
    })

    this.addFacilityForm = this.formBuilder.group({
      FacilityId: 0,
      FacilityName: ['', Validators.required]
    })

    this.getFacility();

    //this.addRoomForm.valueChanges.subscribe(data => this.refreshFacility())
  }

  createAmenity(): FormGroup{
    return this.formBuilder.group({
      Name: ['', Validators.required],
      Quantity:  ['']
    })
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.addRoomForm.controls[controlName].hasError(errorName);
  }

  public hasErrorFacility = (controlName: string, errorName: string) => {
    return this.addFacilityForm.controls[controlName].hasError(errorName);
  }

  refreshFacility(){
    const facLoop = this.addRoomForm.get('Amenities').value;
    facLoop.forEach((e: any) => {
      var index = this.facilities.indexOf(e.Name);
      this.lists.removeAt(index);
    });
  
  }

  getFacility(){    
    this.custS.getFacility().subscribe(data => this.facilities = data)
  }

  public hasErrorOnAddOn = (controlName: string, errorName: string) => {
    return this.addOnForm.controls[controlName].hasError(errorName);
  }

  public hasErrorArray = (i: any) => {
    return (<FormArray> this.addRoomForm.get('Amenities')).controls[i].invalid;
  }

  postCustomer(){
    //console.log(this.addRoomForm.value)
    this.custS.postRoom(this.addRoomForm.value)
              .subscribe(data => {
                if(data){
                  this.toastr.success('Customer Added', 'Success');
                  this.addRoomForm.reset();
                }
              })
  }

  postFacility(){
    this.custS.postFacility({})
        .subscribe(data => console.log(data))
  }

  addFacility(){     
    
    this.lists = this.addRoomForm.get('Amenities') as FormArray;

    if(this.facilities.length == this.lists.length) return;
    this.lists.push(this.createAmenity())
    
  }

  getValidity(i) {
    return (<FormArray>this.addRoomForm.get('Amenities')).controls[i].hasError('what');
  }

  removeFacility(e: any){
    this.lists = this.addRoomForm.get('Amenities') as FormArray    
    this.lists.removeAt(e)
  }

  postAddOn(){
    
    this.custS.postAddOn({
      AddOnId: 0,
      AddOnName: (this.addOnForm.get('AddOnName').value).toUpperCase(),
      Description: this.addOnForm.get('Description').value
    }).subscribe(data => {
      if(data){
        this.toastr.success('Addon Added', 'Success');
        this.addOnForm.reset();
      }
    })
  }

}
