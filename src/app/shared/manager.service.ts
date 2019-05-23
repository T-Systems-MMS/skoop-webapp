import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../users/user';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserIdentityService } from './user-identity.service';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private managerUrlPattern = `${environment.serverApiUrl}/users/{userId}/manager`;
  private subordinatesUrlPattern = `${environment.serverApiUrl}/users/{userId}/subordinates`;

  constructor(private httpClient: HttpClient,
              private userIdentityService: UserIdentityService) {
  }

  getUserManager(): Observable<User> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.get<User>(this.managerUrlPattern.replace('{userId}', userIdentity.userId))
      ));
  }

  getSubordinates(): Observable<User[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.get<User[]>(this.subordinatesUrlPattern.replace('{userId}', userIdentity.userId))
      ));
  }
}
