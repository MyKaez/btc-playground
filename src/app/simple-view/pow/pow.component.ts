import { Component } from '@angular/core';
import { delay } from 'src/app/shared/delay';
import { createBlockId } from 'src/app/simulators/helpers/block';
import { SimpleViewComponent } from '../simple-view.component';

@Component({
  selector: 'app-simple-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['../simple-view.component.scss', '../../materials.scss', '../../app.component.scss']
})
export class PowComponent {

  public simText: string = '';
  public hashes: string[] = []

  switchMode(): void {
    SimpleViewComponent.app!.switchMode();
  }

  navigateTo(link: string) {
    SimpleViewComponent.app!.navigateTo(link);
  }

  async simulate() {
    this.simText = '';
    for (let i = 0; i < 20; i++) {
      this.hashes.push(createBlockId());
      await delay(100);
    }
  }
}
