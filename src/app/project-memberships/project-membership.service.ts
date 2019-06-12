import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectMembershipService {

  private approveAllUrlPattern = `${environment.serverApiUrl}/projects/{userId}/approve-all`;

  constructor(private httpClient: HttpClient) {
  }

  approveAll(userId: string): Observable<void> {
    return this.httpClient.put<void>(this.approveAllUrlPattern.replace('{userId}', userId),{});
  }
}
