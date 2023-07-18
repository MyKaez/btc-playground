import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Session, SessionAction, SessionControlInfo, SessionInfo } from '../models/session';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(@Inject('BTCIS.ME-API') private url: string, private httpClient: HttpClient) { }

  getAll(): Observable<SessionInfo[]> {
    return this.httpClient.get(`${this.url}/v1/sessions`).pipe(
      map(value => <SessionInfo[]>value)
    )
  }

  getBlocktrainerSession(): Observable<SessionControlInfo> {
    return this.httpClient.get(`${this.url}/v1/sessions/blocktrainer`).pipe(
      map(value => <SessionControlInfo>value)
    )
  }

  getSession(sessionId: string, controlId?: string): Observable<SessionInfo> {
    let url = `${this.url}/v1/sessions/${sessionId}`;
    if (controlId) {
      url += `?controlId=${controlId}`;
    }
    return this.httpClient.get(url).pipe(
      map(value => {
        if (!controlId) {
          return <SessionInfo>value;
        }
        return <SessionControlInfo>{ ...value, 'controlId': controlId };
      }),
    )
  }

  createSession(session: Session): Observable<SessionControlInfo> {
    return this.httpClient.post(`${this.url}/v1/sessions`, session).pipe(
      map(value => <SessionControlInfo>value)
    )
  }

  sendMessage(session: SessionControlInfo, message: Message): Observable<SessionInfo> {
    const req = {
      controlId: session.controlId,
      ...message
    };
    return this.httpClient.post(`${this.url}/v1/sessions/${session.id}/messages`, req).pipe(
      map(value => <SessionInfo>value)
    )
  }

  executeAction(session: SessionControlInfo, action: SessionAction, configuration?: any): Observable<SessionInfo> {
    const req = {
      controlId: session.controlId,
      action: action,
      configuration: configuration
    };
    return this.httpClient.post(`${this.url}/v1/sessions/${session.id}/actions`, req).pipe(
      map(value => <SessionInfo>value)
    )
  }

  update(session: SessionControlInfo, configuration?: any): Observable<SessionInfo> {
    const req = {
      controlId: session.controlId,
      action: 'update',
      configuration: configuration
    };
    return this.httpClient.post(`${this.url}/v1/sessions/${session.id}`, req).pipe(
      map(value => <SessionInfo>value)
    )
  }
}
