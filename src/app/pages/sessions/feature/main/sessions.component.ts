import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject, catchError, combineLatest, filter, map, merge, of, shareReplay, switchMap, take, tap } from 'rxjs';
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

  getSessionById$ = this.params$.pipe(
    filter(data => data.sessionId !== undefined && data.sessionId !== null),
    filter(data => !data.sessionId.includes('beach')),
    switchMap(p => this.sessionService.getSession(p.sessionId, p.controlId).pipe(
      catchError(error => {
        let sessionUrl = this.route.snapshot.url.map(u => u.path).reduce((p, c) => p + '/' + c, '');
        if (sessionUrl.includes('sessions')) {
          sessionUrl = sessionUrl.substring(0, sessionUrl.indexOf('/sessions')) + '/sessions/';
        }
        console.error(error);
        if (error.status === 404) {
          this.notificationService.display("Die Session gibt es nicht - Seite wird aktualisiert!");
        } else {
          this.notificationService.display("Da hat etwas nicht geklappt - Seite wird aktualisiert!");
        }
        this.router.navigate([sessionUrl]);
        return of(undefined);
      })
    ))
  );

  createSession$ = this.session.pipe(
    filter(session => session !== undefined && session !== null),
    switchMap(session => this.sessionService.createSession(session).pipe(
      catchError(error => {
        console.error(error);
        this.notificationService.display("Da hat etwas nicht geklappt - bitte noch mal probieren!");
        this.load.next(false);
        return of(undefined);
      })
    )),
    map(session => {
      if (!session) {
        return session;
      }
      let sessionUrl = this.route.snapshot.url.map(u => u.path).reduce((p, c) => p + '/' + c, '');
      if (!sessionUrl.includes('sessions')) {
        sessionUrl = sessionUrl + '/sessions/';
      }
      if (!sessionUrl.endsWith('/')) {
        sessionUrl = sessionUrl + '/';
      }
      this.router.navigate([sessionUrl + session.id, { controlId: session.controlId }]);
      return undefined;
    })
  );

  currentSession$ = merge(this.getSessionById$, this.createSession$).pipe(
    filter(s => s !== undefined && s !== null),
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

  getReady(users: User[]) {
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
