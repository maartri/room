import { Injectable } from '@angular/core'
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';

const customer: string = "api/customer"
const facility: string = "api/facility"
const room: string = "api/room"
const addon: string = "api/addOn"
const booking: string = "api/booking"

@Injectable()
export class CustomerService {

    constructor(
        private auth: AuthService
    ){  }

    addCustomer(data: any): Observable<any>{
        return this.auth.post(`${customer}`, data);
    }

    getCustomer(): Observable<any>{
        return this.auth.get(`${customer}`);
    }

    deleteCustomer(id: number): Observable<any>{
        return this.auth.delete(`${customer}/${id}`);
    }


    getFacility(): Observable<any>{
        return this.auth.get(`${facility}`);
    }

    addFacility(data): Observable<any>{
        return this.auth.post(`${facility}`, data);
    }

    deleteFacility(id: number): Observable<any>{
        return this.auth.delete(`${facility}/${id}`);
    }

    postRoom(data: any): Observable<any>{
        return this.auth.post(`${room}`, data);
    }

    getRoom(): Observable<any>{
        return this.auth.get(`${room}`);
    }

    getVacantRooms(data: any): Observable<any>{
        return this.auth.post(`${room}/vacant`, data);
    }

    postAddOn(data: any): Observable<any>{
        return this.auth.post(`${addon}`, data);
    }

    getAddOn(): Observable<any>{
        return this.auth.get(`${addon}`);
    }

    postBookingDetails(data: any): Observable<any>{
        return this.auth.post(`${booking}`, data);
    }

    getBookingDetails(): Observable<any>{
        return this.auth.get(`${booking}`);
    }

    getSpecificBooking(id:number): Observable<any>{
        return this.auth.get(`${booking}/booking/${id}`);
    }

    postFacility(data: any): Observable<any>{
        return this.auth.post(`${facility}`, data);
    }

    
}