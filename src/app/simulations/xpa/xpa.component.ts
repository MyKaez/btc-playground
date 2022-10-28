import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';

@Component({
  selector: 'app-xpa',
  templateUrl: './xpa.component.html',
  styleUrls: ['../../app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class XpaComponent implements OnInit {

  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.Plane);
  }

}
