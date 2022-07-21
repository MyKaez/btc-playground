import { Component } from '@angular/core';
import { delay } from 'src/app/shared/delay';
import { SimpleViewComponent } from '../simple-view.component';

@Component({
  selector: 'app-simple-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['../simple-view.component.scss', '../../materials.scss', '../../app.component.scss']
})
export class PowComponent {

  public simText: string = '';

  switchMode(): void {
    SimpleViewComponent.app!.switchMode();
  }

  navigateTo(link: string) {
    SimpleViewComponent.app!.navigateTo(link);
  }

  async simulate() {
    this.simText = '';
    for (let i = 0; i < 150; i++) {
      this.simText += 'Simulating ' + i + '... ';
      await delay(1000);
    }
  }
}
