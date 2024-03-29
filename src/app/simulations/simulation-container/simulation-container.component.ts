import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { first, map, Observable, shareReplay, startWith, Subscription, tap } from 'rxjs';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { Simulation, SimulationService } from '../simulation.service';
import { SimulationHelper } from './simulation-helper';

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
  @Input("simulation-session") simulationSessions?: TemplateRef<any>;
  @Input("content-layout-mode") contentLayoutMode?: ContentLayoutMode;

  private startSimulationListener?: Subscription;

  selectedTabIndex = 1;

  simulation$ = this.simulationService.getSimulationsStream().pipe(
    map(simulations => {
      const parts = this.router.url.substring(1).split('/');
      const currentRoute = `${parts[0]}/${parts[1]}`;
      const sim = simulations.find(sim => sim.navigationLink === currentRoute);
      //console.log(`current simulation: ${sim?.title} `);
      const tab = parts[2];
      if (tab) {
        if (tab === 'definition') {
          this.toDefinition(this);
        } else if (tab === 'simulation') {
          this.toSimulation(this);
        } else if (tab === 'sessions') {
          this.toSessions(this);
        } else if (tab === 'options') {
          this.toOptions(this);
        } else {
          console.log('unknown tab: ' + tab);
          this.toSimulation(this);
        }
      }

      return sim;
    })
  );
  showImageContainer$ = this.simulation$.pipe(map(sim => sim?.imageSrc || sim?.youtubeSrc));
  showVideo$ = this.simulation$.pipe(map(sim => sim?.youtubeSrc && !sim?.imageSrc));

  constructor(public layout: LayoutService, private simulationService: SimulationService,
    private router: Router) {
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

  helper(): SimulationHelper {
    return {
      before: () => this.toSimulation(this),
      after: () => this.toOptions(this)
    }
  }

  toDefinition(container: SimulationContainerComponent): void {
    console.log('switch to definition!');
    container.selectedTabIndex = 0;
  }

  toSimulation(container: SimulationContainerComponent): void {
    console.log('switch to simulation!');
    container.selectedTabIndex = 1;
  }

  toSessions(container: SimulationContainerComponent): void {
    //console.log('switch to session!');
    container.selectedTabIndex = 2;
  }

  toOptions(container: SimulationContainerComponent): void {
    console.log('switch to options!');
    const subscription = this.layout.isSmallScreen$.subscribe(isSmall => {
      if (isSmall) {
        // default, switch to here:
        container.selectedTabIndex = 3;
        // if session triggered this, switch to session
      }
    });
    subscription.unsubscribe();
  }
}
