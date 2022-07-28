import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { calculateHashDetails, calculateHexaDecimalFormula } from '../../hash.methods';
import { ApiBlock, Block } from './interfaces';

@Component({
  selector: 'app-pow-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['../pow.component.scss', '../../../materials.scss']
})
export class CalculatorComponent implements AfterViewInit {
  private readonly latBlocks: Block[] = [{
    difficulty: 0, hash: '', height: 0
  }];

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit(): void {
    const url = 'https://chain.api.btc.com/v3/block/latest';
    this.http.get<ApiBlock>(url).subscribe(res => {
      this.latestBlocks.push(res.data);
      this.latestBlocks.shift();
    });
  }

  public get latestBlocks(): Block[] {
    return this.latBlocks;
  }

  public get currentBlock(): Block {
    return this.latBlocks[0];
  }

  public get probabilityString(): string {
    let places = this.probability.toString().split('-')[1];
    return this.probability.toFixed(Number(places) + 5) + '...%'
  }

  public get probability(): number {
    return 1 / this.currentBlock.difficulty;
  }

  get hexaDecimalFormula(): string {
    let [leadingZeros, probability] = calculateHashDetails(this.probability);
    let formula = calculateHexaDecimalFormula(leadingZeros, probability);

    return formula;
  }
}
