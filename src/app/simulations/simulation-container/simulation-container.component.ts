import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';

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
  selectedTabIndex = 1;

  constructor(private layout: LayoutService) { 
    this.isHandset$ = layout.isHandset;
  }

  ngOnInit() {
    if(this.contentLayoutMode != null) this.layout.setLayoutMode(this.contentLayoutMode);
    this.layout.isSimulation = true;
  }

  ngOnDestroy(): void {
    this.layout.isSimulation = false;
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }
}
