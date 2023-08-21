import { Component } from '@angular/core';
import { ContentLayoutMode, LayoutService } from '..';
import { Simulation, SimulationService } from '../../simulations';

@Component({
  selector: 'app-simple-simulations',
  templateUrl: './simulations.component.html',
  styleUrls: ['./simulations.component.scss']
})
export class SimulationsComponent {
  simulations: Simulation[] = [];
  apiLoaded = false;

  constructor(
    private layout: LayoutService, simulationService: SimulationService) {
    this.simulations = simulationService.getSimulations();
  }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.LockImage);
  }
}