import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../layout-service';
import { TeamService } from './team.service';
import { ContactDescription, Display } from './types';

@Component({
  selector: 'app-about-the-team',
  templateUrl: './about-the-team.component.html',
  styleUrls: ['./about-the-team.component.scss']
})
export class AboutTheTeamComponent implements OnInit {
  contacts: ContactDescription[] = [];
  displays: Display[] = [];

  constructor(private layout: LayoutService, private teamService: TeamService) { }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
    this.contacts = this.teamService.getContactDescriptions();
    this.displays = this.contacts.map(contact => Display.create(contact));
  }

  getImage(contact: ContactDescription): string {
    const display = this.displays.find(dis => dis.isMatch(contact));
    if (display) {
      return display.activeImage.srcFile;
    }
    return "";
  }
}
