import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../layout-service';

@Component({
  selector: 'app-about-the-team',
  templateUrl: './about-the-team.component.html',
  styleUrls: ['./about-the-team.component.scss']
})
export class AboutTheTeamComponent implements OnInit {
  
  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
  }

}
