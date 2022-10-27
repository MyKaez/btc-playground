import { Component, OnInit } from '@angular/core';
import { LayoutService, ContentLayoutMode } from '../pages';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
  }
}