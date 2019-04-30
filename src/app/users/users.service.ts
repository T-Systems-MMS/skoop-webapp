import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserIdentityService } from '../shared/user-identity.service';
import { User } from './user';
import { UserPermission } from './user-permission';
import { UserPermissionScope } from './user-permission-scope';
import { UserRequest } from './user-request';
import { UserPermissionRequest } from '../permissions/user-permission-request';
import { GlobalUserPermission } from '../permissions/global-user-permission';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userUrlPattern = `${environment.serverApiUrl}/users/{userId}`;
  private userPermissionsUrlPattern = `${environment.serverApiUrl}/users/{userId}/outbound-permissions`;
  private userGlobalPermissionsUrlPattern = `${environment.serverApiUrl}/users/{userId}/global-permissions`;
  private userInboundPermissionsUrlPattern = `${environment.serverApiUrl}/users/{userId}/inbound-permissions`;
  private userSuggestionsUrl = `${environment.serverApiUrl}/user-suggestions`;

  constructor(private httpClient: HttpClient,
    private userIdentityService: UserIdentityService) { }

  getUser(): Observable<User> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.get<User>(this.userUrlPattern.replace('{userId}', userIdentity.userId))
      ));
  }

  getUserById(userId: string): Observable<User> {
    return this.httpClient.get<User>(this.userUrlPattern.replace('{userId}', userId));
  }

  updateUser(userData: UserRequest): Observable<User> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.put<User>(this.userUrlPattern.replace('{userId}', userIdentity.userId), userData,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          })
      ));
  }

  getUserSuggestions(search: string): Observable<User[]> {
    if (!search) { return of([]); }
    return this.httpClient.get<User[]>(this.userSuggestionsUrl,
      {
        params: new HttpParams().set('search', search)
      });
  }

  getPermissions(): Observable<UserPermission[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(
        switchMap(userIdentity => this.httpClient.get<UserPermission[]>(
          // TODO: Request permissions for given scope via specific API call, e.g.
          // GET /users/{userId}/permissions/{scope}
          this.userPermissionsUrlPattern.replace('{userId}', userIdentity.userId))
        )
      );
  }

  updatePermissions(userPermissions: UserPermissionRequest[]): Observable<UserPermission[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(
        switchMap(userIdentity => this.httpClient.put<UserPermission[]>(
          // TODO: Update permissions for given scope via specific API call, e.g.
          // PUT /users/{userId}/permissions/{scope}
          this.userPermissionsUrlPattern.replace('{userId}', userIdentity.userId), userPermissions)
        )
      );
  }

  getPermissionOwners(scope: UserPermissionScope): Observable<User[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(
        switchMap(userIdentity => this.httpClient.get<UserPermission[]>(
          // TODO: Request permissions for given scope via specific API call, e.g.
          // GET /users/{userId}/permissions/{scope}
          this.userInboundPermissionsUrlPattern.replace('{userId}', userIdentity.userId))
        ),
        map(userPermissions => {
          const inboundUserPermissions = userPermissions.filter(userPermission => userPermission.scope === scope);
          const permissionOwners = [];
          inboundUserPermissions.forEach(item => permissionOwners.push(item.owner));
          return permissionOwners;
        })
      );
  }

  getGlobalUserPermissions(): Observable<GlobalUserPermission[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(
        switchMap(userIdentity => this.httpClient.get<GlobalUserPermission[]>(
          this.userGlobalPermissionsUrlPattern.replace('{userId}', userIdentity.userId))
        ));
  }

  updateGlobalUserPermissions(globalUserPermissions: GlobalUserPermission[]): Observable<GlobalUserPermission[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(
        switchMap(userIdentity => this.httpClient.put<GlobalUserPermission[]>(
          this.userGlobalPermissionsUrlPattern.replace('{userId}', userIdentity.userId), globalUserPermissions)
        )
      );
  }
}
