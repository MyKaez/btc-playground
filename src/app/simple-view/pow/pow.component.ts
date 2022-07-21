import { Component } from '@angular/core';
import { SimpleViewComponent } from '../simple-view.component';

@Component({
  selector: 'app-simple-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['../simple-view.component.scss']
})
export class PowComponent {

  switchMode(): void {
    SimpleViewComponent.app!.switchMode();
  }

  navigateTo(link: string) {
    SimpleViewComponent.app!.navigateTo(link);
  }

}
