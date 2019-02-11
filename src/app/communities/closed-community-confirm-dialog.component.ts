import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-closed-community-confirm-dialog',
  templateUrl: './closed-community-confirm-dialog.component.html',
  styleUrls: ['./closed-community-confirm-dialog.component.scss']
})
export class ClosedCommunityConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ClosedCommunityConfirmDialogComponent>) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

}
