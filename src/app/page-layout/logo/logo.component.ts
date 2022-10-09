import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  title: string = 'The Bitcoin Playground';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(link: string): void {
    this.router.navigate(['/' + link]);
  }
}
