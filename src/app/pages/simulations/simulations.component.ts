import { Component } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '..';
import { SimulationCardProps } from '../../simulations/simulation-card/simulation-card.component';
import { SimulationService } from './simulation.service';

@Component({
  selector: 'app-simple-simulations',
  templateUrl: './simulations.component.html',
  styleUrls: ['./simulations.component.scss']
})
export class SimulationsComponent {
  simulations: SimulationCardProps[] = [];
  apiLoaded = false;

  constructor(
    private layout: LayoutService, simulationService: SimulationService) {
    this.simulations = simulationService.getSimulations();
  }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
  }
}