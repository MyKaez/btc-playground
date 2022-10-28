import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContentLayoutMode, LayoutService } from '..';
import { SimulationCardProps } from '../../simulations/simulation-card/simulation-card.component';

@Component({
  selector: 'app-simple-simulations',
  templateUrl: './simulations.component.html',
  styleUrls: ['./simulations.component.scss']
})
export class SimulationsComponent {
  simulations: SimulationCardProps[] = [];
  apiLoaded = false;

  constructor(
    private layout: LayoutService) {
    this.simulations = this.getSimulations();
  }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
  }

  private getSimulations(): SimulationCardProps[] {
    return [{
      title: "Blocksize",
      description: "Wie entwickelt sich die Blockchain Größe?",
      imageSrc: "assets/Miner_seite2.png",
      youtubeSrc: "Act1XIKj1w0",
      navigationLink: "simulations/blocksize"
    }, {
      title: "Proof of Work",
      description: "Fixes this... Determinismus / Vorhersehbarkeit",
      imageSrc: "assets/Miner_seite2.png",
      youtubeSrc: "MRNSudh565Y",
      navigationLink: "simulations/pow"
    }, {
      title: "51% Attacke",
      description: "Stellen wir uns vor, China kauft das Internet...",
      imageSrc: "assets/Miner_seite2.png",
      youtubeSrc: "-adMIa1jV80",
      navigationLink: "simulations/xpa"
    }, {
      title: "Ring Of Fire",
      description: "Wie funktioniert denn Lightning?",
      imageSrc: "assets/Miner_seite2.png",
      youtubeSrc: "88PSUCvErPA",
      navigationLink: "simulations/rof"
    }];
  }
}