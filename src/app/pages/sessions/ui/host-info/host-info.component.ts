import { Component, Input } from '@angular/core';
import { ViewModel } from 'src/app/models/view-model';

@Component({
  selector: 'app-host-info',
  templateUrl: './host-info.component.html',
  styleUrls: ['./host-info.component.scss']
})
export class HostInfoComponent {

  @Input("vm") vm!: ViewModel;


}
