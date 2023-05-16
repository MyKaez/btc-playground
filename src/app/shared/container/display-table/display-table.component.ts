import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DisplayTableCell } from './display-table-cell';

@Component({
  selector: 'app-display-table',
  templateUrl: './display-table.component.html',
  styleUrls: ['./display-table.component.scss']
})
export class DisplayTableComponent implements OnInit {
  @Input("cells") cells?: DisplayTableCell[][];

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns = ["name", "color"];

  frozenCells = [
    { name: "ice", color: "white-blueish"},
    { name: "snow", color: "crystal-white"},
    { name: "haze", color : "deep-blue"}
  ]

}
