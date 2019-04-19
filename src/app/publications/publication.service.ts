import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicationResponse } from './publication-response';
import { PublicationRequest } from './publication-request';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserIdentityService } from '../shared/user-identity.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private publicationsUrlPattern = `${environment.serverApiUrl}/users/{userId}/publications`;
  private publicationUrlPattern = `${environment.serverApiUrl}/users/{userId}/publications/{publicationId}`;

  constructor(private httpClient: HttpClient,
              private userIdentityService: UserIdentityService) {
  }

  getPublications(): Observable<PublicationResponse[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.get<PublicationResponse[]>(this.publicationsUrlPattern.replace('{userId}', userIdentity.userId))));
  }

  createPublication(publication: PublicationRequest): Observable<PublicationResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.post<PublicationResponse>(this.publicationsUrlPattern.replace('{userId}', userIdentity.userId), publication)));
  }

  editPublication(publication: PublicationRequest): Observable<PublicationResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.put<PublicationResponse>(this.publicationUrlPattern
          .replace('{userId}', userIdentity.userId).replace('{publicationId}', publication.id), publication)));
  }

  deletePublication(publicationId: string): Observable<void> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.delete<void>(this.publicationUrlPattern
          .replace('{userId}', userIdentity.userId).replace('{publicationId}', publicationId))));
  }

}
