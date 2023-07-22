import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, combineLatest, delay, filter, map, merge, of, shareReplay, switchMap, take, tap } from 'rxjs';
import { ConnectionService } from 'src/app/core/connection.service';
import { SessionService } from 'src/app/core/session.service';
import { Message } from 'src/app/models/message';
import { Session, SessionControlInfo } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { ViewModel } from 'src/app/models/view-model';
import { NotificationService } from 'src/app/shared/media/notification.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent {

  @Input("simulationType") simulationType !: string;

  private session = new Subject<Session>();
  private load = new Subject<boolean>();

  hideMessageCenter = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private connectionService: ConnectionService,
    private notificationService: NotificationService
  ) {
  }

  messages: Message[] = [];

  params$ = this.route.params.pipe(
    map(p => ({ sessionId: p['sessionId'], controlId: p['controlId'] })),
    shareReplay(1)
  );

  blocktrainer$ = this.params$.pipe(
    filter(data => data.sessionId === 'beach'),
    switchMap(_ => this.sessionService.getBlocktrainerSession().pipe(catchError(_ => of(undefined)))),
    map(session => {
      if (!session) {
        return undefined;
      }
      let sessionUrl = this.route.snapshot.url.map(u => u.path).reduce((p, c) => p + '/' + c, '');
      if (sessionUrl.includes('sessions')) {
        sessionUrl = sessionUrl.substring(0, sessionUrl.indexOf('/sessions/')) + '/sessions/';
      }
      this.router.navigate([sessionUrl + session.id]);
      return undefined;
    }),
  );

  blocktrainerAdmin$ = this.params$.pipe(
    filter(data => data.sessionId === 'beach-admin'),
    switchMap(_ => this.sessionService.getBlocktrainerSession().pipe(catchError(_ => of(undefined)))),
    map(session => {
      if (!session) {
        return undefined;
      }
      let sessionUrl = this.route.snapshot.url.map(u => u.path).reduce((p, c) => p + '/' + c, '');
      if (sessionUrl.includes('sessions')) {
        sessionUrl = sessionUrl.substring(0, sessionUrl.indexOf('/sessions/')) + '/sessions/';
      }
      this.router.navigate([sessionUrl + session.id, { controlId: session.controlId }]);
      return undefined;
    })
  );

  getSessionById$ = this.params$.pipe(
    filter(data => data.sessionId !== undefined && data.sessionId !== null),
    filter(data => !data.sessionId.includes('beach')),
    switchMap(p => this.sessionService.getSession(p.sessionId, p.controlId).pipe(
      catchError(error => {
        if (error.status === 404) {
          let sessionUrl = this.route.snapshot.url.map(u => u.path).reduce((p, c) => p + '/' + c, '');
          if (sessionUrl.includes('sessions')) {
            sessionUrl = sessionUrl.substring(0, sessionUrl.indexOf('/sessions/')) + '/sessions/';
          }
          this.router.navigate([sessionUrl]);
          return of(undefined);
        } else {
          throw error;
        }
      })
    ))
  );

  createSession$ = this.session.pipe(
    filter(session => session !== undefined && session !== null),
    switchMap(session => this.sessionService.createSession(session).pipe(
      catchError(error => {
        if (error.status === 400) {
          this.notificationService.display(error.error.errorMessage);
          this.load.next(false);
          return of(undefined);
        } else {
          throw error;
        }
      })
    )),
    map(session => {
      if (session) {
        let sessionUrl = this.route.snapshot.url.map(u => u.path).reduce((p, c) => p + '/' + c, '');
        if (!sessionUrl.includes('sessions')) {
          sessionUrl = sessionUrl + '/sessions/';
        }
        if (!sessionUrl.endsWith('/')) {
          sessionUrl = sessionUrl + '/';
        }
        this.router.navigate([sessionUrl + session.id, { controlId: session.controlId }]);
      }
      return of(undefined);
    })
  );

  currentSession$ = merge(this.getSessionById$, this.createSession$, this.blocktrainer$, this.blocktrainerAdmin$
  ).pipe(
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
    tap(vm => this.connectionService.connect(vm)),
    shareReplay(1)
  );

  loading$ = this.load.pipe();

  getNotReady(users: User[]) {
    return users.filter(u => u.status !== 'notReady').length
  }

  logOut() {
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
