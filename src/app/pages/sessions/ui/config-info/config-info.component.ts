import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-info',
  templateUrl: './config-info.component.html',
  styleUrls: ['./config-info.component.scss']
})
export class ConfigInfoComponent implements OnInit {

  @Input("config") config!: any;

  keys: string[] = [];

  ngOnInit(): void {
    this.keys = Object.keys(this.config);
  }

}
