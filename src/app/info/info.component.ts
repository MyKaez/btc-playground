import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../pages';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  
  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.Plane);
  }

}
