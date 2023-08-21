import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { EMPTY, catchError } from 'rxjs';
import { SessionService } from 'src/app/core/session.service';
import { SessionAction, SessionControlInfo, SessionStatus } from 'src/app/models/session';
import { ViewModel } from 'src/app/models/view-model';
import { NotificationService } from 'src/app/shared/media/notification.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements AfterViewInit {

  @Input("vm") vm!: ViewModel;

  @ViewChild("prepareButton") prepareButton!: MatButton;
  @ViewChild("startButton") startButton!: MatButton;
  @ViewChild("stopButton") stopButton!: MatButton;
  @ViewChild("clearButton") clearButton !: MatButton;

  private context: { button: MatButton, action: SessionAction, status: SessionStatus }[] = [];

  constructor(private sessionService: SessionService, private notificationService: NotificationService) {
  }

  get controlSession(): SessionControlInfo {
    return <SessionControlInfo>this.vm.session;
  }

  ngAfterViewInit(): void {
    this.vm.userUpdates.push(() => this.onUserUpdate());
    this.context.push({ button: this.prepareButton, action: 'prepare', status: 'notStarted' });
    this.context.push({ button: this.startButton, action: 'start', status: 'preparing' });
    this.context.push({ button: this.stopButton, action: 'stop', status: 'started' });
    this.context.push({ button: this.clearButton, action: 'reset', status: 'stopped' });
    this.context.forEach(button => {
      if (button.status !== this.controlSession.status) {
        button.button.disabled = true;
      }
    });
  }

  onUserUpdate() {
    if (this.controlSession.status === 'preparing') {
      const users = this.controlSession.users.filter(u => u.status === 'ready');
      const currentButton = this.context.find(b => b.action === 'start')!;
      currentButton.button.disabled = users.length === 0;
    } else if (this.controlSession.status === 'stopped') {
      if (this.controlSession.users.find(u => u.status === 'done')) {
        this.updateButtons('stop');
      }
    }
  }

  prepare() {
    this.createUpdate('prepare', { simulationType: 'proofOfWork' });
  }

  start() {
    this.createUpdate('start');
  }

  stop() {
    this.createUpdate('stop');
  }

  clear() {
    this.createUpdate('reset');
  }

  createUpdate(action: SessionAction, config?: any): void {
    const configuration = config ?? {
      ...(this.controlSession.configuration ?? {}),
      ...this.controlSession.configuration
    };
    console.log(JSON.stringify(configuration));
    const subscription = this.sessionService.executeAction(this.controlSession, action, configuration).pipe(
      catchError(err => {
        console.error(err);
        this.notificationService.display('Etwas ist schiefgegangen - bitte noch mal probieren!')
        return EMPTY;
      })
    ).subscribe(_ => {
      this.updateButtons(action);
      subscription.unsubscribe();
    });
  }

  updateButtons(action: SessionAction) {
    const currentButtonIndex = this.context.findIndex(b => b.action === action)!;
    const currentButton = this.context[currentButtonIndex];
    currentButton.button.disabled = true;
    const nextButton = this.context.length - 1 == currentButtonIndex
      ? this.context[0].button : this.context[currentButtonIndex + 1].button;
    nextButton.disabled = false;
  }
}
