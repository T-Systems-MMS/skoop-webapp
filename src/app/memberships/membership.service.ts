import { Injectable } from '@angular/core';
import { MembershipRequest } from './membership-request';
import { Observable } from 'rxjs';
import { MembershipResponse } from './membership-response';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserIdentityService } from '../shared/user-identity.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  private membershipsUrlPattern = `${environment.serverApiUrl}/users/{userId}/memberships`;
  private membershipUrlPattern = `${environment.serverApiUrl}/users/{userId}/memberships/{membershipId}`;

  constructor(private httpClient: HttpClient,
              private userIdentityService: UserIdentityService) {
  }


  createMembership(membership: MembershipRequest): Observable<MembershipResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.post<MembershipResponse>(this.membershipsUrlPattern.replace('{userId}', userIdentity.userId), membership)));
  }

  editMembership(membership: MembershipRequest): Observable<MembershipResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.put<MembershipResponse>(this.membershipUrlPattern
          .replace('{userId}', userIdentity.userId).replace('{membershipId}', membership.id), membership)));
  }
}
