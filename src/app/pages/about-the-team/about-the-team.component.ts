import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../layout-service';
import { ContactDescription, TeamService } from './team.service';

@Component({
  selector: 'app-about-the-team',
  templateUrl: './about-the-team.component.html',
  styleUrls: ['./about-the-team.component.scss']
})
export class AboutTheTeamComponent implements OnInit {
  contacts: ContactDescription[] = [];

  constructor(private layout: LayoutService, private teamService: TeamService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.Plane);
    this.contacts = this.teamService.getContactDescriptions();
  }
}
