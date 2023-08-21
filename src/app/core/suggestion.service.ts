import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SessionSuggestion, UserSuggestion } from '../models/suggesion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  constructor(@Inject('BTCIS.ME-API') private url: string, private httpClient: HttpClient) { }

  suggestSession(): Observable<SessionSuggestion> {
    return this.httpClient.get(`${this.url}/v1/suggestions/sessions`).pipe(
      map(value => <SessionSuggestion>value)
    )
  }

  suggestUser(): Observable<UserSuggestion> {
    return this.httpClient.get(`${this.url}/v1/suggestions/users`).pipe(
      map(value => <UserSuggestion>value)
    )
  }
}
