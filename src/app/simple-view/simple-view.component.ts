import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-simple-view',
  templateUrl: './simple-view.component.html',
  styleUrls: ['./simple-view.component.scss', '../materials.scss', '../app.component.scss']
})
export class SimpleViewComponent implements OnInit {
  public static app: AppComponent;

  ngOnInit(): void {
  }

  navigateTo(link: string) {
    SimpleViewComponent.app!.navigateTo(link);
  }
}
