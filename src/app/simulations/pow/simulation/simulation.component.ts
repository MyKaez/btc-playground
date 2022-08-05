import { Component, OnInit } from '@angular/core';
import { delay } from 'src/app/shared/delay';
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

  private powService: PowService;
  private cachedHashes: PowHash[];

  public maxHashRate: number = 50;
  public hashNo: number;
  public isProcessing: boolean;
  public isCalculating: boolean;
  public executedHashrates: number;
  public stopOnFoundBlock: boolean;
  public clearOnStart: boolean;

  constructor() {
    this.hashNo = 0;
    this.executedHashrates = 0;
    this.cachedHashes = [];
    this.isProcessing = false;
    this.isCalculating = false;
    this.stopOnFoundBlock = true;
    this.clearOnStart = true;
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

  ngOnInit(): void {
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
