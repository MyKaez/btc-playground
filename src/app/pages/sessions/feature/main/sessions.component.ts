import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, combineLatest, delay, filter, map, merge, of, shareReplay, switchMap, take, tap } from 'rxjs';
import { ConnectionService } from 'src/app/core/connection.service';
import { SessionService } from 'src/app/core/session.service';
import { Message } from 'src/app/models/message';
import { Session, SessionControlInfo } from 'src/app/models/session';
import { ViewModel } from 'src/app/models/view-model';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent {

  private static readonly LOCAL_STORAGE = 'sessionHost';

  private session = new Subject<Session>();
  private load = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private connectionService: ConnectionService) {
  }

  type: 'session-info' | 'message-center' | 'user-action' = 'session-info';
  messages: Message[] = [];
  getSessionById$ = this.route.params.pipe(
    map(p => p['sessionId']),
    filter(sessionId => sessionId !== undefined && sessionId !== null),
    switchMap(p => this.sessionService.getSession(p).pipe(
      catchError(error => {
        if (error.status === 404) {
          // this.router.navigate(['/session']);
          return of(undefined);
        } else {
          throw error;
        }
      })
    )),
    tap(_ => this.type = 'user-action')
  );

  storedSession$ = of(localStorage.getItem(SessionsComponent.LOCAL_STORAGE)).pipe(
    filter(session => session !== undefined && session !== null),
    delay(200), // we should delay this, since it's just a fallback!! 
    map(session => <SessionControlInfo>JSON.parse(session!)),
    switchMap(session => this.sessionService.getSession(session.id).pipe(
      map(inner => <SessionControlInfo>{ ...session, ...inner }),
      catchError(error => {
        if (error.status === 404) {
          localStorage.removeItem(SessionsComponent.LOCAL_STORAGE);
          return of(undefined);
        } else {
          throw error;
        }
      })
    ))
  );

  createSession$ = this.session.pipe(
    filter(session => session !== undefined && session !== null),
    switchMap(session => this.sessionService.createSession(session)),
    tap(session => localStorage.setItem(SessionsComponent.LOCAL_STORAGE, JSON.stringify({ ...session, users: [] }))),
  );

  currentSession$ = merge(this.getSessionById$, this.createSession$, this.storedSession$).pipe(
    filter(session => session !== undefined),
    take(1),
    map(session => <SessionControlInfo>session),
    switchMap(session => this.sessionService.getSession(session.id).pipe(
      map(inner => <SessionControlInfo>{ ...session, ...inner })
    )),
    shareReplay(1)
  );

  hubConnection$ = of(this.connectionService.createConnection());

  vm$ = combineLatest([this.currentSession$, this.hubConnection$]).pipe(
    map(([session, connection]) => new ViewModel(session, connection)),
    tap(vm => this.connectionService.connect(vm, messages => this.messages = [...messages, ...this.messages])),
    shareReplay(1)
  );

  loading$ = this.load.pipe();

  logOut() {
    localStorage.removeItem(SessionsComponent.LOCAL_STORAGE);
    let url = window.location.href ?? '';
    if (url.includes('/sessions/')) {
      url = url.substring(0, url.indexOf('/sessions/'));
    }
    window.open(url, '_self');
  }

  registerSession(sessionName: string): void {
    this.load.next(true);
    const session = { name: sessionName };
    this.session.next(session);
  }
}
