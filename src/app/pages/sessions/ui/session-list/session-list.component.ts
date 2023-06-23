import { Component, OnInit } from '@angular/core';
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

  openSession(sessionId: string) {
    let baseUrl = window.location.href
      .replace('http://', '')
      .replace('https://', '');
    baseUrl = baseUrl.substring(baseUrl.indexOf('/'));
    const sessionUrl = baseUrl + '/sessions/' + sessionId;
    alert(sessionUrl)
    this.router.navigate([sessionUrl]);
  }
}
