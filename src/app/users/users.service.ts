import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserIdentityService } from '../shared/user-identity.service';
import { Observable } from 'rxjs';
import { User } from './user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userUrl = `${environment.serverApiUrl}/users`;
  private userUrlPattern = `${environment.serverApiUrl}/users/{userId}`;

  constructor(private httpClient: HttpClient,
    private userIdentityService: UserIdentityService) { }

  getUser(): Observable<User> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.get<User>(this.userUrlPattern.replace('{userId}', userIdentity.userId))
      ));
  }

  updateUser(userName: string, coach: boolean): Observable<User> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.put<User>(this.userUrlPattern.replace('{userId}', userIdentity.userId),
          {
            userName,
            coach,
          },
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          })
      ));
  }

}
