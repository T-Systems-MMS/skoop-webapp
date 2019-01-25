import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private downloadUserProfileUrlPattern = `${environment.serverApiUrl}/download/users/{userReferenceId}`;

  constructor(private httpClient: HttpClient) { }

  public downloadAnonymousUserProfile(userReferenceId: string): Observable<Blob> {
    return this.httpClient.get<Blob>(this.downloadUserProfileUrlPattern
      .replace('{userReferenceId}', userReferenceId), {responseType: 'blob' as 'json'});
  }
}
