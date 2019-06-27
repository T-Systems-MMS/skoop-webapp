import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfileSearchResult } from './user-profile-search-result';

@Injectable({
  providedIn: 'root'
})
export class UserProfileSearchService {

  // todo replace with api url and remove search-result.json file
  private searchUrlPattern = '/assets/mock/search-result.json';

  constructor(private httpClient: HttpClient) {
  }

  public search(terms: string[]): Observable<UserProfileSearchResult[]> {
    return this.httpClient.get<UserProfileSearchResult[]>(this.searchUrlPattern, {
      params: new HttpParams().set('terms', terms.join(','))
    });
  }
}
