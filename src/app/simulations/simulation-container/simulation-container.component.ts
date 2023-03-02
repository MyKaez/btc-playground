import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, Subscription } from 'rxjs';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { SimulationService } from '../simulation.service';

@Component({
  selector: 'app-simulation-container',
  templateUrl: './simulation-container.component.html',
  styleUrls: ['./simulation-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimulationContainerComponent implements OnInit {
  @Input("simulation-body") simulationBody?: TemplateRef<any>;
  @Input("simulation-controls") simulationControls?: TemplateRef<any>;
  @Input("simulation-definition") simulationDefinition?: TemplateRef<any>;
  @Input("video-id") videoId?: string;
  @Input("content-layout-mode") contentLayoutMode?: ContentLayoutMode;

  isHandset$: Observable<boolean>;
  private startSimulationListener?: Subscription;
  selectedTabIndex = 1;

  constructor(public layout: LayoutService, private simulationService: SimulationService) {
    this.isHandset$ = layout.isHandset$;
  }

  ngOnInit() {
    if (this.contentLayoutMode != null) this.layout.setLayoutMode(this.contentLayoutMode);
    this.layout.isSimulation = true;
    this.startSimulationListener = this.simulationService.listeningToStartSimulation.subscribe({ next: isStarted => this.onStartedSimulation(isStarted) });
  }

  ngOnDestroy(): void {
    this.layout.isSimulation = false;
    if (this.startSimulationListener) this.startSimulationListener.unsubscribe();
  }

  onStartedSimulation(isStarted: boolean) {
    this.selectedTabIndex = 1; // Move to simulation
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }
}
