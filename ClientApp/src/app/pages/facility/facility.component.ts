import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CustomerService } from '../../services/customer.service'
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {
  addFacilityForm: FormGroup;
  displayedColumns: string[] = ['facilityId', 'facilityName','actions'];
  dataSource = null;

  constructor(
    private formBuilder: FormBuilder,
    private custS: CustomerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.addFacilityForm = this.formBuilder.group({
      FacilityName: ['', Validators.required]      
    })

    this.getFacility();
  }

  getFacility(){
    this.custS.getFacility()
    .subscribe(data => {
      console.log(data)
      this.dataSource = data
    })
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.addFacilityForm.controls[controlName].hasError(errorName);
  }

  addFacility(){
    const { FacilityName } = this.addFacilityForm.value;

    this.custS.addFacility({
      FacilityName: (FacilityName).toUpperCase()
    }).subscribe(data => {
      if(data){
        this.toastr.success('Facility Added', 'Success');
        this.addFacilityForm.reset()
        this.getFacility();
      }
    })

  }

  deleteFacility(el :any){
    console.log(el);

    this.custS.deleteFacility(el.facilityId)
    .subscribe(data => {
      if(data){
        this.toastr.success('Facility Deleted', 'Success');
        this.getFacility();
      }
    })
  }

}
