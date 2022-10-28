import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { PowTabParamMapping, PowTabs } from './pow-tabs';

@Component({
  selector: 'app-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['../../app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PowComponent implements OnInit {
  public selectedTabIndex = 1;

  constructor(private route: ActivatedRoute,
    private layout: LayoutService) {

  }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.Plane);
    this.initializeTabRoute();
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }

  private initializeTabRoute() {
    const tabRouteValue = this.route.snapshot.paramMap.get('tab') as string;
    if(!tabRouteValue) return;

    const selectedTab = PowTabParamMapping[tabRouteValue.toLowerCase()];
    if(selectedTab == null) {      
      console.warn(`Failed at parsing tab route for value. Use any of ${Object.keys(PowTabParamMapping).join(";")} instead of `, tabRouteValue);
      return;
    }

    this.selectedTabIndex = selectedTab;
  }
}
