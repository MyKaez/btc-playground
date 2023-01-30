import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ContentLayoutMode } from 'src/app/pages';

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

  halvings$: Observable<Halving[]> = this.formGroup.valueChanges
    .pipe(
      map(formGroup => {
        const data: Halving[] = [];
        for (let i = 0; i <= (formGroup.halvingCount ?? 0); i++) {
          const satCount = (formGroup.satCount ?? 0);
          const coinsPerBlock = Math.floor((formGroup.coinCount ?? 0) / Math.pow(2, i) * (satCount)) / satCount;
          const coinsPerHalving = coinsPerBlock * (formGroup.blockCount ?? 0);
          const halving: Halving = {
            number: i + 1,
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


  ngAfterViewInit(): void {
    this.formGroup.setValue({
      halvingCount: 32,
      blockCount: 210_000,
      coinCount: 50,
      satCount: 100_000_000
    });
  }

  getData(halvings: Halving[]) {
    return halvings[halvings.length - 1].totalCoins;
  }
}
