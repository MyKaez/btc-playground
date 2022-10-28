import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebHelper } from 'src/model/web';

@Component({
  selector: 'app-simulation-card',
  templateUrl: './simulation-card.component.html',
  styleUrls: ['./simulation-card.component.scss']
})
export class SimulationCardComponent implements OnInit, SimulationCardProps {
  @Input("title")
  title = DefaultSimulationCardProps.title;

  @Input("description")
  description = DefaultSimulationCardProps.description;

  @Input("image-src")
  imageSrc = DefaultSimulationCardProps.imageSrc;

  @Input("youtube-src")
  youtubeSrc = DefaultSimulationCardProps.youtubeSrc;

  @Input("navigation-link")
  navigationLink = DefaultSimulationCardProps.navigationLink;

  constructor(private router: Router) { }

  ngOnInit(): void {
    WebHelper.ensureYoutubeIframe();
  }

  navigateTo(link: string): void {
    this.router.navigate(['/' + link]);
  }
}

export interface SimulationCardProps {
  title: string;
  description: string;
  imageSrc: string;
  youtubeSrc: string;
  navigationLink: string;
}

export const DefaultSimulationCardProps: SimulationCardProps = {
  title: "You missed a title",
  description: "Every card needs some little description",
  imageSrc: "https://www.innovationnewsnetwork.com/wp-content/uploads/2021/07/iStockPitris-831501722-696x392.jpg",
  youtubeSrc: "dQw4w9WgXcQ", // To Rick
  navigationLink: ""
}
