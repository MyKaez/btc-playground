import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simple-simulations',
  templateUrl: './simulations.component.html',
  styleUrls: ['./simulations.component.scss']
})
export class SimulationsComponent {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  navigateTo(link: string): void {
    this.router.navigate(['/' + link]);
  }
}
