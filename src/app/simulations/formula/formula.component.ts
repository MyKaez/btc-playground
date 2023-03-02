import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';

interface Halving {
  number: number;
  coinsPerBlock: number;
  coinsPerHalving: number;
  totalCoins: number;
}

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
})
export class FormulaComponent implements AfterViewInit {
  readonly displayedColumns = [
    { prop: 'number', text: 'Nr.' },
    { prop: 'coinsPerBlock', text: 'Coins pro Block' },
    { prop: 'coinsPerHalving', text: 'Coins pro Halving' },
    { prop: 'totalCoins', text: 'Gesamtanzahl Coins' },
  ];

  contentLayoutMode = ContentLayoutMode.LockImage;

  halvingCount = new FormControl(0);
  blockCount = new FormControl(0);
  coinCount = new FormControl(0);
  satCount = new FormControl(0);
  formGroup = new FormGroup({
    halvingCount: this.halvingCount,
    blockCount: this.blockCount,
    coinCount: this.coinCount,
    satCount: this.satCount
  });

  constructor(layout: LayoutService) {
    this.isHandset$ = layout.isHandset$;
  }

  halvings$: Observable<Halving[]> = this.formGroup.valueChanges
    .pipe(
      map(formGroup => {
        const data: Halving[] = [];
        for (let i = 0; i <= (formGroup.halvingCount ?? 0); i++) {
          const satCount = (formGroup.satCount ?? 0);
          const coinsPerBlock = Math.floor((formGroup.coinCount ?? 0) / Math.pow(2, i) * (satCount)) / satCount;
          const coinsPerHalving = coinsPerBlock * (formGroup.blockCount ?? 0);
          const halving: Halving = {
            number: i,
            coinsPerBlock: coinsPerBlock,
            coinsPerHalving: coinsPerHalving,
            totalCoins: data.length == 0
              ? coinsPerHalving
              : data.map(d => d.coinsPerHalving).reduce((prev, cur) => prev + cur) + coinsPerHalving
          }
          data.push(halving);
        }
        return data;
      })
    );
  isHandset$: Observable<boolean>;

  ngAfterViewInit(): void {
    this.formGroup.setValue({
      halvingCount: 32,
      blockCount: 210_000,
      coinCount: 50,
      satCount: 100_000_000
    });
  }

  getSeparatorLine(halvings: Halving[], column: { prop: string, text: string }): string {
    const max = halvings.map(halving => {
      const valueLength = this.getValue(halving, column.prop).length;
      const longerValue = valueLength > column.text.length ? valueLength : column.text.length;
      return longerValue + 1;
    }).reduce((prev, cur) => cur > prev ? cur : prev, 0);
    return ''.padStart(max, '-');
  }

  getValue(halving: any, column: string): string {
    const fixed = ['coinsPerBlock', 'coinsPerHalving', 'totalCoins'];
    if (fixed.includes(column)) {
      return Number.parseFloat(halving[column]).toFixed(8);
    }
    return halving[column];
  }

  getData(halvings: Halving[]) {
    return halvings[halvings.length - 1].totalCoins;
  }
}
