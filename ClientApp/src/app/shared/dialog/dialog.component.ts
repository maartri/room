import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { AdminComponent } from '../../pages/admin/admin.component'

export interface DialogData {
  facilities: Array<any>;
  addons: Array<any>;
  name: string,
  bookDetails: any
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.component.html',
})

export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      //console.log(this.data)
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}