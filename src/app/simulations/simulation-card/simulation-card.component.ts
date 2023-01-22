import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Simulation } from 'src/app/simulations/simulation.service';
import { WebHelper } from 'src/model/web';

@Component({
  selector: 'app-simulation-card',
  templateUrl: './simulation-card.component.html',
  styleUrls: ['./simulation-card.component.scss']
})
export class SimulationCardComponent implements OnInit, Simulation {
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

export const DefaultSimulationCardProps: Simulation = {
  title: "You missed a title",
  description: "Every card needs some little description",
  imageSrc: "https://www.innovationnewsnetwork.com/wp-content/uploads/2021/07/iStockPitris-831501722-696x392.jpg",
  youtubeSrc: "dQw4w9WgXcQ", // To Rick
  navigationLink: ""
}
