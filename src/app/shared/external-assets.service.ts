import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalAssetsService {

  constructor(private httpClient: HttpClient) {
  }

  getText(filePath: string): Observable<string> {
    return this.httpClient.get(filePath, {responseType: 'text'});
  }

  getJSON<T>(filePath: string): Observable<T> {
    return this.httpClient.get<T>(filePath);
  }
}
