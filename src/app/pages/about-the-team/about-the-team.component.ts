import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '../layout-service';
import { ContactDescription, Display, TeamService } from './team.service';

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
    this.displays = this.contacts.map(contact => new Display(contact.name, contact.images));
  }

  getImage(contact: ContactDescription): string {
    const display = this.displays.find(dis => dis.name === contact.name);
    if (display) {
      return display.activeImage.srcFile;
    }
    return "";
  }
}
