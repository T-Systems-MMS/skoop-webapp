import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss']
})
export class DeleteConfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.delete = true;
    if (!this.data.message) {
      this.data.message = 'Do you want to delete the record?';
    }
  }

  onNoClick(): void {
    this.data.delete = false;
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}

export interface DialogData {
  message: String;
  delete: boolean;
}
