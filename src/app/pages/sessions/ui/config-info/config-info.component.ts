import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-config-info',
  templateUrl: './config-info.component.html',
  styleUrls: ['./config-info.component.scss']
})
export class ConfigInfoComponent {

  @Input("config") config!: any

}
