import {Component,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CustomerService } from '../../services/customer.service'

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  addForm: FormGroup;

  displayedColumns: string[] = ['customerId', 'customerFirstName', 'customerLastName','actions'];
  dataSource = null;

  constructor(
    private custS: CustomerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      CustomerFirstName: ['', Validators.required],
      CustomerLastName: ['', Validators.required]
    })

    this.getAllCustomers();
  }

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.addForm.controls[controlName].hasError(errorName);
  }

  getAllCustomers(){
    this.custS.getCustomer()
    .subscribe(data => {
      this.dataSource = data
    })
  }

  postCustomer(){
    this.custS.addCustomer(
      this.addForm.value
    ).subscribe(data => {
      if(data){
        this.addForm.reset();
        this.getAllCustomers();
      }
    })
  }

  delete(el: any){
    this.custS.deleteCustomer(el.customerId)
        .subscribe(data => {
          if(data){
            this.getAllCustomers();
          }
        })
  }

}
