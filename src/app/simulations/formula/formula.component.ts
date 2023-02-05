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
  readonly separator: string = '|';
  readonly columns = ['Nr', 'Coins pro Block', 'Coins im Halving', 'Gesamtanzahl Coins '];

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
    this.isHandset$ = layout.isHandset;
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

  public get header(): string {
    let header = '';
    for (let c of this.columns) {
      header += ' ' + c.padEnd(c.length, '.') + ' ' + this.separator;
    }
    header = header.substring(0, header.length - this.separator.length);
    return header;
  }

  public get headerLine(): string {
    const length = this.columns
      .map(c => c.length + this.separator.length)
      .reduce((prev, cur,) => prev + cur)
      - 1;
    return ''.padEnd(length, '-');
  }

  getString(halving: Halving) {
    const addStartPadding = (val: string) => val.split('.')[0].length == 1 ? '0' + val : val;
    const num = addStartPadding(halving.number.toString());
    const blockCoins = addStartPadding(halving.coinsPerBlock.toFixed(8));
    const halvingCoins = halving.coinsPerHalving.toFixed(8);
    const totalCoins = halving.totalCoins.toFixed(8);
    return `${num} | ${blockCoins} | ${halvingCoins} | ${totalCoins}`;
  }

  getData(halvings: Halving[]) {
    return halvings[halvings.length - 1].totalCoins;
  }
}
function keys<T>() {
  throw new Error('Function not implemented.');
}

