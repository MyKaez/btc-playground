import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-info',
  templateUrl: './config-info.component.html',
  styleUrls: ['./config-info.component.scss']
})
export class ConfigInfoComponent implements OnInit {

  @Input("config") config!: any;

  keys: string[] = [];
  infos: ConfigInfo[] = [
    { property: 'secondsUntilBlock', editable: true, sendData: true },
    { property: 'totalHashRate', editable: false, sendData: true },
  ]

  isReadonly(property: string): boolean {
    return !(this.infos.find(info => info.property === property)?.editable ?? false);
  }

  ngOnInit(): void {
    this.keys = Object.keys(this.config);
  }

}
export interface ConfigInfo {
  property: string;
  editable: boolean;
  sendData: boolean;
}