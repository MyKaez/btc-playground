import { Component, Input } from '@angular/core';
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

  @Input("simulationType") simulationType !: string;

  private session = new Subject<Session>();
  private load = new Subject<boolean>();
  hideMessageCenter = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private connectionService: ConnectionService,
  ) {
  }

  type: 'session-info' | 'message-center' | 'user-action' = 'session-info';
  messages: Message[] = [];

  params$ = this.route.params.pipe(
    map(p => ({ sessionId: p['sessionId'], controlId: p['controlId'] })),
    shareReplay(1)
  );

  getSessionById$ = this.params$.pipe(
    filter(data => data.sessionId !== undefined && data.sessionId !== null),
    switchMap(p => this.sessionService.getSession(p.sessionId, p.controlId).pipe(
      catchError(error => {
        if (error.status === 404) {
          let sessionUrl = window.location.href
            .replace('http://', '')
            .replace('https://', '');
          sessionUrl = sessionUrl.substring(sessionUrl.indexOf('/'));
          if (sessionUrl.includes('/sessions/')) {
            localStorage.removeItem(SessionsComponent.LOCAL_STORAGE);
            sessionUrl = sessionUrl.substring(0, sessionUrl.indexOf('/sessions/')) + '/sessions/';
          }
          this.router.navigate([sessionUrl]);
          return of(undefined);
        } else {
          throw error;
        }
      })
    )),
    tap(_ => this.type = 'user-action'),
    tap(session => {
      if ('controlId' in (session ?? {})) {
        localStorage.setItem(SessionsComponent.LOCAL_STORAGE, JSON.stringify(session));
        // todo: we need to get rid off the ids in the url!
      }
    })
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
    const session = { name: sessionName, simulationType: this.simulationType };
    this.session.next(session);
  }
}
