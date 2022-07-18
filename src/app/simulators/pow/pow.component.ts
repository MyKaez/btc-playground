import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Block } from '../block';

@Component({
  selector: 'app-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['./pow.component.scss']
})
export class PowComponent implements OnInit {
  private _blocks: Block[] = [];
  private _runJob: boolean = false;
  private _hashRate: number = 10;
  private _blockTime: number = 10;
  private _blockNo: number = 0;

  public dataSource: MatTableDataSource<Block>;
  public processedBlockTimes: number = 0;
  public stopOnFoundBlock: boolean = true;

  constructor() {
    this.dataSource = new MatTableDataSource(this.blocks);
  }

  public get isProcessing(): boolean {
    return this._runJob;
  }

  public get probability(): number {
    if (this._hashRate === 0 || this._blockTime === 0) {
      return Number.NaN;
    }
    return 1 / (this._hashRate * this._blockTime);
  }

  public get blocks(): Block[] {
    return this._blocks;
  }

  public get displayedColumns(): string[] {
    return ['id', 'isValid', 'serialNo', 'processTime', 'difficulty'];
  }

  public get hashRate(): number {
    return this._hashRate;
  }

  public set hashRate(value: number) {
    if (value <= 0 || Number.isNaN(value)) {
      return;
    }
    this._hashRate = value;
  }

  public get blockTime(): number {
    return this._blockTime;
  }

  public set blockTime(value: number) {
    if (value <= 0 || Number.isNaN(value)) {
      return;
    }
    this._blockTime = value;
  }

  public get expectedPrefixes(): string {
    const res = [];
    const input = this.getValidationInput();
    const leadingZero = input[0];
    const probability = input[1];
    let x = '';
    for (let i = 0; i < leadingZero; i++) {
      x += '0';
    }
    for (let i = 0; i < probability; i++) {
      res.push(x + i.toString(16));
    }
    return res.reduce((prev, cur) => prev += ', ' + cur, '').substring(2);
  }

  ngOnInit(): void {
  }

  async start() {
    if (this._runJob) {
      return;
    }
    this._runJob = true;
    await this.createJob();
  }

  createJob(): Promise<string> {
    return new Promise(async resolve => {
      const delay = 1000 / this.hashRate;
      const validationInput = this.getValidationInput();
      while (this._runJob) {
        for (let i = 0; i < this.hashRate; i++) {
          const block = this.createBlock(validationInput[0], validationInput[1]);
          this.blocks.push(block);
          this.dataSource.data = this.blocks.reverse().filter((_, i) => i <= 50);
          if (this.stopOnFoundBlock && block.isValid) {
            this.stop();
            break;
          }
          await this.delay(delay);
        }
        this.processedBlockTimes++;
      }
      resolve('done');
    });
  }

  createBlock(leadingZeros: number, probability: number): Block {
    const id = this.createBlockId();
    const block = {
      id: id,
      processTime: this.processedBlockTimes,
      difficulty: this.probability,
      serialNo: this._blockNo++,
      isValid: this.probability === 1
        ? true
        : this.validate(id, leadingZeros, probability)
    };
    return block;
  }

  getValidationInput(): [number, number] {
    let probability = this.probability;
    let leadingZeros = 0;
    for (let i = 0; i < this.createBlockId().length; i++) {
      probability = probability * 16;
      if (probability >= 1) {
        break;
      }
      leadingZeros++;
    }
    probability = Math.round(probability);
    return [leadingZeros, probability];
  }

  validate(id: string, leadingZeros: number, probability: number): boolean {
    let zerosOnly = id.substring(0, leadingZeros);
    for (let i = 0; i < leadingZeros; i++) {
      zerosOnly = zerosOnly.replace('0', '');
    }
    if (zerosOnly.length > 0) {
      return false;
    }
    let relevantChar = id.substring(leadingZeros, leadingZeros + 1);
    let hex = '0x' + relevantChar;
    return Number.parseInt(hex) <= probability;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop(): void {
    this._runJob = false;
  }

  clear(): void {
    if (this._runJob) {
      return;
    }
    this._blocks = [];
    this.dataSource.data = this.blocks;
    this.processedBlockTimes = 0;
    this._blockNo = 0;
  }

  createBlockId(): string {
    // origins from here: https://www.cloudhadoop.com/javascript-uuid-tutorial/#:~:text=Typescript%20-%20generate%20UUID%20or%20GUID%20with%20an,directly%20use%20the%20uuid%20%28%29%20function%20as%20below.
    let uuidValue = "", k, randomValue;
    for (k = 0; k < 64; k++) {
      randomValue = Math.random() * 16 | 0;
      uuidValue += randomValue.toString(16);
    }
    return uuidValue;
  }
}
