import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { SessionService } from 'src/app/core/session.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent {

  constructor(private sessionService: SessionService, private router: Router, private activatedRoute: ActivatedRoute) { }

  sessions$ = this.sessionService.getAll().pipe();

  logInSession(sessionId: string, controlId: string) {
    if (controlId === undefined || controlId === null || controlId === '') {
      alert('control id is required');
      return;
    }
    const subscription = this.sessionService.getSession(sessionId, controlId).pipe(
      catchError(err => {
        if (err.status === 404) {
          alert('not found');
        } else if (err.status === 401) {
          alert('false control id');
        }
        return EMPTY;
      })
    ).subscribe(session => {
      this.openSession(session.id, controlId);
      subscription.unsubscribe();
    });
  }

  openSession(sessionId: string, controlId?: string) {
    let sessionUrl = this.activatedRoute.snapshot.url.map(u => u.path).reduce((p, c) => p + '/' + c, '');
    if (sessionUrl.includes('sessions')) {
      sessionUrl += '/' + sessionId;
    }
    else {
      sessionUrl += '/sessions/' + sessionId;
    }
    if (controlId) {
      this.router.navigate([sessionUrl, { controlId: controlId }]);
    }
    else {
      this.router.navigate([sessionUrl]);
    }
  }
}
