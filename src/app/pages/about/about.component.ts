import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../layout-service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
  }
}