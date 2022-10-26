import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  backgroundImage = `url(${HomeBackgroundImages[0]})`;

  constructor() { }

  ngOnInit(): void {
  }
}

const HomeBackgroundImages: string[] = [
  "/assets/img/fixed-crystals.png",
  "/assets/img/fixed-cascade.png",
  "/assets/img/fixed-connected.png"
] 