import { Component, OnInit } from '@angular/core';
import { delay } from 'src/app/shared/delay';
import { Column } from 'src/app/shared/helpers/interfaces';
import { PowHash } from './interfaces';
import { PowService } from './pow.service';

@Component({
  selector: 'app-pow-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['../../../app.component.scss', '../../../materials.scss']
})
export class SimulationComponent implements OnInit {
  public readonly minHashRate = 1;
  public readonly maxAmountOfHashesToShow = 200;
  public readonly minAmountOfHashesToShow = 1;
  private readonly separator = ' | ';

  private powService: PowService;
  private cachedHashes: PowHash[];

  public maxHashRate: number = 50;
  public hashNo: number;
  public isProcessing: boolean;
  public isCalculating: boolean;
  public executedHashrates: number;
  public stopOnFoundBlock: boolean;
  public clearOnStart: boolean;
  public blink: boolean;

  constructor() {
    this.hashNo = 0;
    this.executedHashrates = 0;
    this.cachedHashes = [];
    this.isProcessing = false;
    this.isCalculating = false;
    this.stopOnFoundBlock = true;
    this.clearOnStart = true;
    this.blink = true;
    this.powService = new PowService();
  }

  public get hashes() {
    return this.cachedHashes.filter((_, index) => index < this.amountHashesToShow);
  }

  public get amountHashesToShow(): Number {
    return Number.parseInt(localStorage.getItem('sim_pow_amountHashesToShow') ?? '3');
  }

  public set amountHashesToShow(value: Number) {
    localStorage.setItem('sim_pow_amountHashesToShow', value.toString());
  }

  public get displayedColumns(): string[] {
    return ['id', 'isValid', 'serialNo', 'hashRate'];
  }

  public get hashRate(): number {
    return this.powService.hashRate;
  }

  public set hashRate(value: number) {
    if (value < this.minHashRate || Number.isNaN(value)) {
      return;
    }
    this.powService.hashRate = value;
  }

  public get externalHashRate(): number {
    return this.powService.externalHashRate;
  }

  public set externalHashRate(value: number) {
    if (value < 0 || Number.isNaN(value)) {
      return;
    }
    this.powService.externalHashRate = value;
  }

  public get blockTime(): number {
    return this.powService.blockTime;
  }

  public set blockTime(value: number) {
    if (value <= 0 || Number.isNaN(value)) {
      return;
    }
    this.powService.blockTime = value;
  }

  public get probability(): number {
    return this.powService.probability;
  }

  public get expectedAmountOfBlocks(): number {
    return this.powService.expectedAmountOfBlocks;
  }

  public get expectedAmountOfHashrates(): number {
    return this.powService.expectedAmountOfHashrates;
  }

  public get expectedPrefixes(): string {
    return this.powService.expectedPrefixes;
  }

  public get hexaDecimalFormula(): string {
    return this.powService.hexaDecimalFormula;
  }

  public get header(): string {
    let header = '';
    for (let c of this.columns) {
      header += c.name.padEnd(c.length, '.') + this.separator;
    }
    header = header.substring(0, header.length - this.separator.length);
    return header;
  }

  public get headerLine(): string {
    const length = this.columns
      .map(c => c.length + this.separator.length)
      .reduce((prev, cur,) => prev + cur)
      - this.separator.length;
    return ''.padEnd(length, '-');
  }

  public get columns(): Column<PowHash>[] {
    return [
      {
        name: 'Hash',
        length: 64,
        mapFunc: c => c.id
      },
      {
        name: 'Is Valid',
        length: 'Is Valid'.length,
        mapFunc: c => c.isValid
      },
      {
        name: 'Hashrate',
        length: 'Hashrate'.length,
        mapFunc: c => c.hashRate
      },
      {
        name: 'HashNr',
        length: 'HashNr'.length,
        mapFunc: c => c.serialNo
      }
    ];
  }

  columnValue(hash: PowHash, col: Column<PowHash>): string {
    let val = col.mapFunc(hash).toString().padEnd(col.length, '.');
    if (this.columns.findIndex(c => c.name === col.name) + 1 != this.columns.length) {
      val += ' | ';
    }
    return val;
  }

  async ngOnInit() {
    await this.executeBlink();
  }

  async executeBlink() {
    if (this.isCalculating || this.isProcessing) {
      this.blink = true;
    } else {
      this.blink = !this.blink;
    }
    setTimeout(async () => await this.executeBlink(), this.blink ? 1000 : 500);
  }

  async start() {
    if (this.isProcessing) {
      return;
    }
    if (this.clearOnStart) {
      this.clear();
    }
    this.isProcessing = true;
    await this.createJob();
  }

  async determineHashRate() {
    this.isCalculating = true;
    this.clear();
    let curHash = 0;
    const determineRounds = 5;
    const validationInput = this.powService.validationInput;
    for (let i = 0; i < determineRounds; i++) {
      const start = new Date();
      start.setSeconds(start.getSeconds() + 1);
      while (start.getTime() > new Date().getTime()) {
        const hash = this.powService.createHash(
          validationInput[0], validationInput[1], this.executedHashrates, ++this.hashNo);
        if (this.cachedHashes.unshift(hash) > this.maxAmountOfHashesToShow) {
          this.cachedHashes.pop();
        }
        await delay(1);
      }
      this.hashRate = Math.round(this.cachedHashes.length * 0.75);
      curHash += this.hashRate;
      this.clear();
    }
    this.hashRate = Math.round(curHash / determineRounds);
    this.maxHashRate = this.hashRate;
    this.isCalculating = false;
  }

  createJob(): Promise<string> {
    return new Promise(async resolve => {
      const timeToWait = 1000 / this.hashRate;
      const validationInput = this.powService.validationInput;
      while (this.isProcessing) {
        this.executedHashrates++;
        for (let i = 0; i < this.hashRate; i++) {
          if (!this.isProcessing) {
            break;
          }
          const hash = this.powService.createHash(
            validationInput[0], validationInput[1], this.executedHashrates, ++this.hashNo);
          if (this.cachedHashes.unshift(hash) > this.maxAmountOfHashesToShow) {
            this.cachedHashes.pop();
          }
          if (this.stopOnFoundBlock && hash.isValid) {
            this.stop();
            break;
          }
          await delay(timeToWait);
        }
      }
      resolve('done');
    });
  }

  stop(): void {
    this.isProcessing = false;
  }

  clear(): void {
    if (this.isProcessing) {
      return;
    }
    this.cachedHashes = [];
    this.executedHashrates = 0;
    this.hashNo = 0;
  }
}
