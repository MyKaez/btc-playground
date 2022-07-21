import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-simple-view',
  templateUrl: './simple-view.component.html',
  styleUrls: ['./simple-view.component.scss', '../materials.scss', '../app.component.scss']
})
export class SimpleViewComponent implements OnInit {
  public static app: AppComponent;

  isStart: boolean = true;
  isSimulations: boolean = false;

  ngOnInit(): void {
  }

  switchMode(): void {
    SimpleViewComponent.app!.switchMode();
  }

  navigateTo(view: string): void {
    if (view === 'simulations') {
      this.isStart = false;
      this.isSimulations = true;
    } else {
      this.isStart = true;
      this.isSimulations = false;
    }
  }

  navigateToPow() {
    SimpleViewComponent.app?.navigateTo('pow');
  }
}
