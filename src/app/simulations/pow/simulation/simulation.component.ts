import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TitleStrategy } from '@angular/router';
import { delay } from 'src/app/shared/delay';
import { PowHash } from './interfaces';
import { PowService } from './pow.service';

@Component({
  selector: 'app-pow-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['../pow.component.scss', '../../../materials.scss']
})
export class SimulationComponent implements OnInit {
  public readonly maxHashRate = 50;
  public readonly minHashRate = 1;
  public readonly maxAmountOfHashesToShow = 200;
  public readonly minAmountOfHashesToShow = 1;

  private powService: PowService;

  public hashNo: number;
  public isProcessing: boolean;
  public hashes: PowHash[];
  public dataSource: MatTableDataSource<PowHash>;
  public executedHashrates: number;
  public stopOnFoundBlock: boolean;
  public clearOnStart: boolean;

  constructor() {
    this.hashNo = 0;
    this.executedHashrates = 0;
    this.hashes = [];
    this.isProcessing = false;
    this.stopOnFoundBlock = true;
    this.clearOnStart = true;
    this.powService = new PowService();
    this.dataSource = new MatTableDataSource();
  }

  public get amountHashesToShow(): Number {
    return Number.parseInt(localStorage.getItem('sim_pow_amountHashesToShow') ?? '3');
  }

  public set amountHashesToShow(value: Number) {
    localStorage.setItem('sim_pow_amountHashesToShow', value.toString());
    this.showOutput();
  }

  public get displayedColumns(): string[] {
    return ['id', 'isValid', 'serialNo', 'hashRate', 'difficulty'];
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
    if (this.isProcessing) {
      return;
    }
    this.clear();
    this.isProcessing = true;
    let curHash = 0;
    const determineRounds = 5;
    const validationInput = this.powService.validationInput;
    for (let i = 0; i < determineRounds; i++) {
      const hash = this.powService.createHash(
        validationInput[0], validationInput[1], this.executedHashrates, ++this.hashNo);
      this.hashes.unshift(hash);
      const start = new Date();
      start.setSeconds(start.getSeconds() + 1);
      while (start.getTime() > new Date().getTime()) {
        const hash = this.powService.createHash(
          validationInput[0], validationInput[1], this.executedHashrates, ++this.hashNo);
        if (this.hashes.unshift(hash) > this.maxAmountOfHashesToShow) {
          this.hashes.pop();
        }
        this.showOutput();
        await delay(1);
      }
      this.hashRate = Math.round(this.hashes.length * 0.75);
      curHash += this.hashRate;
      this.isProcessing = false;
      this.clear();
    }
    this.hashRate = Math.round(curHash / determineRounds);
  }

  createJob(): Promise<string> {
    return new Promise(async resolve => {
      const timeToWait = 1000 / this.hashRate;
      const validationInput = this.powService.validationInput;
      while (this.isProcessing) {
        for (let i = 0; i < this.hashRate; i++) {
          const hash = this.powService.createHash(
            validationInput[0], validationInput[1], this.executedHashrates, ++this.hashNo);
          if (this.hashes.unshift(hash) > this.maxAmountOfHashesToShow) {
            this.hashes.pop();
          }
          this.showOutput();
          if (this.stopOnFoundBlock && hash.isValid) {
            this.stop();
            break;
          }
          await delay(timeToWait);
        }
        this.executedHashrates++;
      }
      resolve('done');
    });
  }

  showOutput() {
    this.dataSource.data = this.hashes.filter((_, i) => i < this.amountHashesToShow);
  }

  stop(): void {
    this.isProcessing = false;
  }

  clear(): void {
    if (this.isProcessing) {
      return;
    }
    this.hashes = [];
    this.dataSource.data = this.hashes;
    this.executedHashrates = 0;
    this.hashNo = 0;
  }
}
