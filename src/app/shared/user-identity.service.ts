import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserIdentity } from './user-identity';

@Injectable({
  providedIn: 'root'
})
export class UserIdentityService {
  private userIdentityUrl = '/api/my-identity';

  constructor(private httpClient: HttpClient) { }

  getUserIdentity(): Observable<UserIdentity> {
    return this.httpClient.get<UserIdentity>(this.userIdentityUrl);
  }
}
