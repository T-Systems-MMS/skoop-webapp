import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CommunityResponse } from '../../communities/community-response';

@Component({
  selector: 'app-closed-community-info-dialog',
  templateUrl: './closed-community-info-dialog.component.html',
  styleUrls: ['./closed-community-info-dialog.component.scss']
})
export class ClosedCommunityInfoDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ClosedCommunityInfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public community: CommunityResponse) { }

  ngOnInit() {
  }

}
