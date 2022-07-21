import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-simple-view',
  templateUrl: './simple-view.component.html',
  styleUrls: ['./simple-view.component.scss', '../materials.scss', '../app.component.scss']
})
export class SimpleViewComponent implements OnInit {
  constructor() { }

  @Input() app: AppComponent | undefined;

  ngOnInit(): void {
  }

  switchMode(): void {
    this.app!.switchMode();
  }
}
