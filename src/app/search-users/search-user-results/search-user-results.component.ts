import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnonymousUserSkill } from '../anonymous-user-skill';
import { DownloadService } from './download.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-search-user-results',
  templateUrl: './search-user-results.component.html',
  styleUrls: ['./search-user-results.component.scss']
})
export class SearchUserResultsComponent implements OnInit {

  @Input() userSkills: AnonymousUserSkill[];
  @Output() errorOccurredEvent = new EventEmitter<HttpErrorResponse>();

  constructor(private downloadService: DownloadService) {
  }

  ngOnInit() {
  }

  downloadAnonymousUserProfile(userReference: string): void {
    this.downloadService.downloadAnonymousUserProfile(userReference).subscribe((response: HttpResponse<Blob>) => {
      const contentDispositionHeader: string = response.headers.get('Content-Disposition');
      if (!contentDispositionHeader) {
        throw new Error('The header "Content-Disposition" is not defined');
      }
      const filename: string = contentDispositionHeader.substring('attachment; filename='.length, contentDispositionHeader.length);
      saveAs(response.body, filename);
    }, (errorResponse: HttpErrorResponse) => {
      this.errorOccurredEvent.emit(errorResponse);
    });
  }

}
