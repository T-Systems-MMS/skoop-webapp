import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserIdentity } from './user-identity';

@Injectable({
  providedIn: 'root'
})
export class UserIdentityService {
  private userIdentityUrl = '/api/my-identity';
  private userIdentity: UserIdentity;

  constructor(private httpClient: HttpClient) { }

  getUserIdentity(): Observable<UserIdentity> {
    if (this.userIdentity) { return of(this.userIdentity); }
    return this.httpClient.get<UserIdentity>(this.userIdentityUrl)
      .pipe(tap(userIdentity => this.userIdentity = userIdentity));
  }
}
