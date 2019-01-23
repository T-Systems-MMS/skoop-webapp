import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AnonymousUserSkill } from './anonymous-user-skill';

@Injectable({
  providedIn: 'root'
})
export class SearchUsersService {

  private searchUrlPattern = `${environment.serverApiUrl}/search/users?params={searchParams}`;

  constructor(private httpClient: HttpClient) { }

  public search(criteriaList: string[]): Observable<AnonymousUserSkill[]> {
    return this.httpClient.get<AnonymousUserSkill[]>(this.searchUrlPattern.replace('{searchParams}', encodeURIComponent(criteriaList.join(','))));
  }
}
