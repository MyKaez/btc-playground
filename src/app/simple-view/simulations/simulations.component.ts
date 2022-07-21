import { Component } from '@angular/core';
import { SimpleViewComponent } from '../simple-view.component';

@Component({
  selector: 'app-simple-simulations',
  templateUrl: './simulations.component.html',
  styleUrls: ['../simple-view.component.scss']
})
export class SimulationsComponent {

  switchMode(): void {
    SimpleViewComponent.app!.switchMode();
  }

  navigateTo(link: string) {
    SimpleViewComponent.app!.navigateTo(link);
  }
}
