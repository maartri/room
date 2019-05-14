import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './pages/home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { RoomComponent } from './pages/room/room.component';
import { CustomerComponent } from './pages/customer/customer.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule,MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,MatTableModule,MatIconModule, MatSelectModule, MatStepperModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatExpansionModule } from '@angular/material';

import { CustomerService } from './services/customer.service'
import { AuthService } from './services/auth.service';
import { AreaComponent } from './shared/area/area.component'

import { BsModalModule } from 'ng2-bs3-modal';
import { FacilityComponent } from './pages/facility/facility.component';
import { ToastrModule } from 'ngx-toastr'

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DatePickerComponent } from './shared/datepicker/datepicker.component';
import { AdminComponent } from './pages/admin/admin.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogComponent } from './shared/dialog/dialog.component'; 

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    RoomComponent,
    CustomerComponent,
    AreaComponent,
    FacilityComponent,
    DatePickerComponent,
    AdminComponent,
    DialogComponent
  ],

  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,  
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatDialogModule,

    FullCalendarModule,
    NgxMaterialTimepickerModule,
    BsModalModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'room', component: RoomComponent },
      { path: 'customer', component:  CustomerComponent },
      { path: 'facility', component:  FacilityComponent },
      { path: 'admin', component:  AdminComponent }
    ])
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    CustomerService,
    AuthService
  ],
  exports: [
    DialogComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogComponent
  ]
})
export class AppModule { }
