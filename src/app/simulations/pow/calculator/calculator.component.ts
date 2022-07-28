import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BLOCK_ID_LENGTH } from 'src/app/shared/helpers/block';
import { calculateHashDetails, calculateHexaDecimalFormula } from '../../hash.methods';
import { ApiBlock, Block } from './interfaces';

@Component({
  selector: 'app-pow-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['../pow.component.scss', '../../../materials.scss']
})
export class CalculatorComponent implements OnInit {
  private curBlock: Block = {
    height: 0,
    difficulty: 0,
    hash: ''
  };

  constructor(private http: HttpClient) {
  }

  public get currentBlock(): Block {
    return this.curBlock;
  }

  public set currentBlock(value: Block) {
    this.curBlock = value;
  }

  public get probabilityString(): string {
    let places = this.probability.toString().split('-')[1];
    return this.probability.toFixed(Number(places) + 5) + '...%'
  }

  public get probability(): number {
    return 1 / this.curBlock.difficulty;
  }

  get hexaDecimalFormula(): string {
    let [leadingZeros, probability] = calculateHashDetails(this.probability);
    let formula = calculateHexaDecimalFormula(leadingZeros, probability);

    return formula;
  }


  ngOnInit(): void {
    const url = 'https://chain.api.btc.com/v3/block/latest';
    this.http.get<ApiBlock>(url).subscribe(res => {
      this.currentBlock = res.data;
    });
  }

  handleError(e: any): any {
    alert(JSON.stringify(e))
  }

}
