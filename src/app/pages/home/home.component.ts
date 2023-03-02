import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LayoutService, ContentLayoutMode, ContentLayoutImageMode } from '../';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel, { imageMode: ContentLayoutImageMode.Fancy });
  }

  get presentationMode(): boolean {
    return environment.presentationMode;
  }
}