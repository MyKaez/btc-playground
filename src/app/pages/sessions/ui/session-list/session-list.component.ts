import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/core/session.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent {

  constructor(private sessionService: SessionService, private router: Router) { }

  sessions$ = this.sessionService.getAll().pipe();

  logInSession(sessionId: string, controlId: string) {
    alert('Log in to session is not implemented yet. SessionId: ' + sessionId + ', ControlId: ' + controlId);
  }

  openSession(sessionId: string) {
    let baseUrl = window.location.href
      .replace('http://', '')
      .replace('https://', '');
    baseUrl = baseUrl.substring(baseUrl.indexOf('/'));
    let sessionUrl = baseUrl;
    if (baseUrl.includes('sessions'))
      sessionUrl += '/' + sessionId;
    else
      sessionUrl += '/sessions/' + sessionId;
    this.router.navigate([sessionUrl]);
  }
}
