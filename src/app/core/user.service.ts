import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Message } from '../models/message';
import { User, UserControl } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(@Inject('BTCIS.ME-API') private url: string, private httpClient: HttpClient) { }

  getUsers(sessionId: string): Observable<User[]> {
    return this.httpClient.get(`${this.url}/v1/sessions/${sessionId}/users`).pipe(
      map(value => <User[]>value)
    )
  }

  registerUser(sessionId: string, userName: string): Observable<UserControl> {
    const user = { name: userName };
    return this.httpClient.post(`${this.url}/v1/sessions/${sessionId}/users`, user).pipe(
      map(value => <UserControl>value)
    )
  }

  sendMessage(sessionId: string, user: UserControl, message: Message): Observable<User> {
    const req = {
      controlId: user.controlId,
      ...message
    };
    return this.httpClient.post(`${this.url}/v1/sessions/${sessionId}/users/${user.id}/messages`, req).pipe(
      map(value => <User>value)
    )
  }

  sendUpdate(sessionId: string, user: UserControl, configuration: any): Observable<User> {
    const req = {
      controlId: user.controlId,
      status: user.status,
      configuration: configuration
    };
    return this.httpClient.post(`${this.url}/v1/sessions/${sessionId}/users/${user.id}/actions`, req).pipe(
      map(value => <User>value)
    )
  }
}
