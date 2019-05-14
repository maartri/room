import { Component, forwardRef, ElementRef, Input, OnInit } from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';

import * as moment from 'moment';
const months: Array<string> = moment.months();
const noop = () => { };

export const DATEPICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() =>  DatePickerComponent),
};

@Component({
    host:{
        '(document:click)': 'onClick($event)'
    },
    selector: 'datepicker',
    templateUrl:'./datepicker.component.html',
    styles:[
        `    
        input{
            width:100%;
            margin-bottom:0 !important;
        }
        .date-wrapper{
            position: relative;
            -webkit-tap-highlight-color:transparent;
            -webkit-user-select: none;       
            -moz-user-select: none; 
            -ms-user-select: none; 
        
            -o-user-select: none;
            user-select: none;
        }
        .date-wrapper > i{
            position: absolute;
            right: 0;
            bottom:4px;
        }
        .date-body{
          margin: 0;
          width: 19.5rem;
          border: 1px solid #eaeaea;
          border-radius: 3px;
          padding: 10px 7px;
          background: #ffffff;
          z-index: 5;
        }
        .control-switcher{
            width:50%;
        }
        .control-picker{
            display:inline-flex;
            width:50%;
        }
        .control-picker button{   
            color: #447fff;
            font-size: 18px;         
        }
        .control-picker button:hover{
            background:#eeeeff;
        }
        .dd-container button{
            width: 50%;
            height: 40px;
            color: #565656;
            margin: 0 !important;
        
        }
        .dd-container button:hover{
            background:#eeeeff;
        }
        .btn-clear{
            outline:none;
            border:0;
            background:inherit;
        }
        .year-controls{          
            float:right;
        }
        .year-controls > i:hover{
            background:#eeeeff;
            cursor:pointer;
        }
        .year-controls button:hover{
            background:#eeeeff;
        }
        .left{
            transform: rotate(-90deg);
        }
        .right{
            transform: rotate(90deg);
        }
        #days{
            width:100%;
            table-layout:fixed;
        }
        #days th{
            text-align:center;
        }
        #days td{
            text-align: center;
            line-height: 2.5rem;
        }
        #days td:not(.disable):not(.today):hover{
            cursor:pointer;
            background:#eeeeff;
        }
        .disable{
            opacity:0.5;
        }
        .today:not(.disable){
          background: #3f51b5;
          border-radius: 100%;
          color: #fff;
          font-size: 1.1rem;
        }
        td{
            font-size:11px;
        }
        .year-controls-y{
            float:none;
            text-align:center;
            margin: 8px 0;
        }
        .cancel{
            display: flex;
            border-top: 1px solid #ececec;
            cursor:pointer;
        }
        .cancel:hover{
            background:#f7f7f7e8;
        }
        .cancel:hover i{
            color: #777777;
        }
        .cancel i{
            margin: 0 auto;
            color:#adadad;
        }
        `
    ],
    providers: [ DATEPICKER_VALUE_ACCESSOR ]
})

export class DatePickerComponent implements ControlValueAccessor, OnInit {

    @Input() DPrevDays: boolean = false;

    private dateNow: any;

    arrayDate: Array<any> = [];
    public emitDate = new Subject<any>();
    tempValue: any;

    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    show: boolean = false;
    date: any;
    window: number = 1;
    months: Array<string> = months;

    years: Array<number> = [];
    indexYear: number;
    //The internal data model
    private innerValue: any = '';

    constructor(
        private elem: ElementRef
    ){        
        this.emitDate.subscribe(data =>{
            //if(data){
                this.window = 1;
                this.generate(true);
            //}
        })
    }

    ngOnInit(){
      this.emitDate.next(this.show);
    }

    onClick(event: Event){
        if(!this.elem.nativeElement.contains(event.target))
            this.show = false;
    }
   
    //get accessor
    get value(): any {
        return moment(this.innerValue).format('DD MMM YYYY') == 'Invalid date' ? null : moment(this.innerValue).format('DD MMM, YYYY');
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {            
            this.innerValue = value;
            this.changeSelected(this.innerValue)
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    pick(category: string, pick:number){
        if(category == 'm') this.tempValue = moment(this.tempValue).month(pick);
        if(category == 'y') this.tempValue = moment(this.tempValue).year(pick);
        if(category == 'mi') this.tempValue = moment(this.tempValue).add(pick,'M');
        if(category == 'md') this.tempValue = moment(this.tempValue).subtract(pick,'M');        
        
        this.generate();
        this.window = 1;
    }

    pickDate(data:any){   
        if(!data.disable){
            this.value = moment(this.tempValue).date(data.data);
            this.tempValue = this.value;
            this.changeSelected(this.value);
        }
    }

    changeSelected(dateObject:any){
        var date = parseInt(moment(dateObject).format('DD'));
        let found = false;
        this.arrayDate.forEach(data => {
            data.forEach(a => {
                if(a.hasOwnProperty('selected')){
                    a.selected = false;
                    if(date == a.data){
                        found = true;                        
                        a.selected = true;
                    }
                }
            });            
        });
    }

    generate(origin: boolean = false){
        if(origin)
            this.tempValue = moment(this.value);

        if(!this.tempValue)
            this.tempValue = this.value;

        if(moment(this.value).format('YYYY MMMM DD') == 'Invalid date' && origin ){
            this.tempValue = moment();
        }

        if(this.tempValue){      
            let startOfDay = moment(this.tempValue).startOf('month').day();
            let endOfMonth = moment(this.tempValue).subtract(1,'M').daysInMonth();
            let noOfMonth = moment(this.tempValue).daysInMonth();

            let subDay = endOfMonth - startOfDay + 1;
            let arr: Array<any> = [];
            let finalArr: Array<any> = [];

            for(var a = subDay; a <= endOfMonth ; a++){
                arr.push({ disable: true, data: subDay});
                subDay++;
            }

            for(var a = 1; a <= noOfMonth; a++ ){                
                arr.push({ 
                    disable: this.daysDisabled(a), 
                    data: a, 
                    selected: this.isTodaysDate() == a 
                });
            }

            if(arr.length != 42){
                let diff = 42 - arr.length;
                for(var a = 1 ; a <= diff; a++){
                    arr.push({ disable: true, data: a});
                }
            }

            for(var a = 0; a < 6; a++){
               finalArr.push(arr.splice(0,7));
            }

            this.arrayDate = finalArr;
        }
    }
    
    daysDisabled(day: number): boolean {
        if(this.DPrevDays){
            this.dateNow = moment();            
            if( moment(this.dateNow).isAfter(moment(this.tempValue).date(day),'day')  )
                return true;
            return false;
        }
        return false;
    }

    isTodaysDate():number{
       
        if(moment(this.value).format('YYYY-MM-DD') === moment(this.tempValue).format('YYYY-MM-DD')){
            return parseInt(moment(this.tempValue).format('DD'));
        }
        return 0;
    }

    loopYear(result: any){
        this.years = [];
        this.indexYear = result;
        for(var a = 0 ; a < 10 ; a++){
            this.years.push(result);    
            result++;
        }
    }

    populate(){
        let date = this.value;
        if(date == "")
            date = this.tempValue;

        var year = parseInt(moment(date).format('YYYY'));
        var result = (year -(year % 10));
        this.loopYear(result);
    }

    clearDate(){
        this.value = ""
        this.arrayDate.forEach(data => {
            data.forEach(a => {              
                a.selected = false                
            });            
        });
    }

    currDate(){
        const value = moment().format('DD MMM YYYY');
        this.tempValue = value;
        this.changeSelected(value);
        this.generate(false)

        this.writeValue(moment())
    }
}
