import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, combineLatestAll, from, interval, map, merge, Observable } from 'rxjs';
import { DisplayTableCell } from './display-table-cell';

@Component({
  selector: 'app-display-table',
  templateUrl: './display-table.component.html',
  styleUrls: ['./display-table.component.scss']
})
export class DisplayTableComponent implements OnInit {
  frozenCells = [
    { name: "ice", color: "white-blueish" },
    { name: "snow", color: "crystal-white" },
    { name: "haze", color: "deep-blue" }
  ]

  @Input("cells") cells?: DisplayTableCell[][];

  basicCells = from(this.frozenCells);
  ticker = interval(1000);
  livingCells$ = this.ticker.pipe(map(index => {
    const cells = [... this.frozenCells];
    const row = Math.floor(Math.random() * index);
    const propertyIndex = Math.floor(Math.random() * 2);
    const propertyName = Object.keys(cells[row])[propertyIndex];
    (cells[row] as any)[propertyName] = "Xells" + index;
    return cells;
  }));

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns = ["name", "color"];


}
