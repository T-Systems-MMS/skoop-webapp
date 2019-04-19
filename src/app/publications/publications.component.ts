import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { PublicationService } from './publication.service';
import { PublicationsNewComponent } from './publications-new.component';
import { PublicationResponse } from './publication-response';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {

  errorMessage: string = null;

  constructor(private publicationService: PublicationService,
              public dialog: MatDialog,
              private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
  }

  openNewDialog() {
    this.bottomSheet.open(PublicationsNewComponent)
      .afterDismissed().subscribe((publication: PublicationResponse) => {
      if (publication) {
        this.loadPublications();
      }
    });
  }

  private loadPublications() {

  }

}
