import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../layout-service';
import { ContactDescription, TeamService } from './team.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  contacts: ContactDescription[] = [];

  constructor(private layout: LayoutService, private teamService: TeamService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
    this.contacts = this.teamService.getContactDescriptions();
  }
}