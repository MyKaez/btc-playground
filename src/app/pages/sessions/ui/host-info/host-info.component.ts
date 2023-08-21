import { Component, Input } from '@angular/core';
import { SessionStatusDisplayValues } from 'src/app/models/session';
import { ViewModel } from 'src/app/models/view-model';

@Component({
  selector: 'app-host-info',
  templateUrl: './host-info.component.html',
  styleUrls: ['./host-info.component.scss']
})
export class HostInfoComponent {

  @Input("vm") vm!: ViewModel;

  get sessionStatusDisplayValue(): string {
    return SessionStatusDisplayValues[this.vm.session.status];
  }
}
