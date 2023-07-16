import { Component, Input, ViewChild } from '@angular/core';
import { SessionControlInfo, SessionInfo, SessionStatusDisplayValues } from 'src/app/models/session';

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.scss']
})
export class SessionInfoComponent {

  @Input("session") session!: SessionInfo;

  hideControlId: boolean = true;
  isQrFullscreen: boolean = false;

  get sessionStatusDisplayValue(): string {
    return SessionStatusDisplayValues[this.session.status];
  }

  get controlSession(): SessionControlInfo | undefined {
    if ('controlId' in this.session) {
      return <SessionControlInfo>this.session;
    }
    return undefined;
  }

  get sessionLink(): string {
    const sessionId = this.session.id;
    const func = () => {
      if (window.location.href.includes(sessionId))
        return window.location.href;
      if (window.location.href.includes('sessions'))
        return window.location.href + '/' + sessionId;
      return window.location.href + '/sessions/' + sessionId;
    }
    if (!this.controlSession)
      return func();
    return func().replace(';controlId=' + this.controlSession!.controlId, '');
  }

  get hiddenControlId(): string {
    return "".padEnd(this.controlSession!.controlId.length, "*");
  }

  showControlId() {
    this.hideControlId = !this.hideControlId
  }

  openLink(): void {
    if (this.isQrFullscreen) return;
    window.open(this.sessionLink, '_blank');
  }

  copyLink(): void {
    const listener = (e: ClipboardEvent) => {
      e.clipboardData!.setData('text/plain', this.sessionLink);
      e.preventDefault();
      document.removeEventListener('copy', listener);
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
  }

  switchQrFullscreen(event: MouseEvent, toValue?: boolean): boolean {
    this.isQrFullscreen = toValue == null
      ? !this.isQrFullscreen
      : toValue;

    event.stopPropagation();
    return false;
  }

}
