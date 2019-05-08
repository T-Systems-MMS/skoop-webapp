import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateLoaderService {

  constructor(private httpClient: HttpClient) {
  }

  loadTemplate(path: string): Observable<string> {
    return this.httpClient.get(path, {responseType: 'text'});
  }
}
