import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Simulation } from 'src/app/simulations/simulation.service';
import { environment } from 'src/environments/environment';
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
  imageSrc? = DefaultSimulationCardProps.imageSrc;

  @Input("youtube-src")
  youtubeSrc?: string;

  @Input("navigation-link")
  navigationLink = DefaultSimulationCardProps.navigationLink;

  showImage = true;
  defaultImage: string;

  constructor(private router: Router) { 
    this.defaultImage = DefaultSimulationCardProps.imageSrc!;
  }

  ngOnInit(): void {
    WebHelper.ensureYoutubeIframe();
  }

  navigateTo(link: string): void {
    this.router.navigate(['/' + link]);
  }

  getShowImage(): boolean {
    if(!this.youtubeSrc) return true;
    if(environment.presentationMode && this.imageSrc) return true;
    return false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["imageSrc"] || changes["youtubeSrc"]) {
      this.showImage = this.getShowImage();
    }
  }
}

export const DefaultSimulationCardProps: Simulation = {
  title: "You missed a title",
  description: "Every card needs some little description",
  imageSrc: "assets/img/fixed-above.png",
  youtubeSrc: "dQw4w9WgXcQ", // To Rick
}
