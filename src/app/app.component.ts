import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './materials.scss']
})
export class AppComponent implements OnInit {
  title: string = 'The Bitcoin Playground';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  navigateTo(link: string): void {
    this.router.navigate(['/' + link]);
  }
}
