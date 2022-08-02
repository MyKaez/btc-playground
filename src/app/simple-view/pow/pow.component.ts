import { Component } from '@angular/core';
import { delay } from 'src/app/shared/delay';
import { PowService } from 'src/app/simulations/pow/simulation/pow.service';
import { SimpleViewComponent } from '../simple-view.component';

@Component({
  selector: 'app-simple-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['../simple-view.component.scss', '../../materials.scss', '../../app.component.scss']
})
export class PowComponent {
  private powService: PowService;

  public isRunning: boolean;
  public hashes: string[];
  public amountOfHashesCreated: number = 0;
  public maxAmountOfHashesCreated: number = 100;
  public maxHashRate: number = 50;

  constructor() {
    this.hashes = [];
    this.isRunning = false;
    this.powService = new PowService();
  }

  get hashRate(): number {
    return this.powService.hashRate;
  }

  set hashRate(value: number) {
    this.powService.hashRate = value;
  }

  get externalHashRate(): number {
    return this.powService.externalHashRate;
  }

  set externalHashRate(value: number) {
    this.powService.externalHashRate = value;
  }

  get blockTime(): number {
    return this.powService.blockTime;
  }

  set blockTime(value: number) {
    this.powService.blockTime = value;
  }

  get expectedPrefixes(): string {
    return this.powService.expectedPrefixes;
  }

  get expectedAmountOfBlocks(): number {
    return this.powService.expectedAmountOfBlocks;
  }

  get validationInput(): [leadingZeros: number, probability: number] {
    return this.powService.validationInput;
  }

  switchMode(): void {
    SimpleViewComponent.app!.switchMode();
  }

  navigateTo(link: string) {
    SimpleViewComponent.app!.navigateTo(link);
  }

  async simulate() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.hashes = [];
    this.amountOfHashesCreated = 0;
    await this.createJob();
  }

  async stop() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
  }

  createJob(): Promise<string> {
    return new Promise(async resolve => {
      while (this.isRunning) {
        const timeToWait = 1000 / this.hashRate;
        const validationInput = this.validationInput;
        for (let i = 0; i < this.hashRate; i++) {
          if (!this.isRunning) {
            break;
          }
          const block = this.powService.createHash(
            validationInput[0], validationInput[1], 0, 0);
          this.amountOfHashesCreated++;
          if (this.hashes.unshift(block.id) > this.maxAmountOfHashesCreated) {
            this.hashes.pop();
          }
          if (block.isValid) {
            this.isRunning = false;
            break;
          }
          await delay(timeToWait);
        }
      }
      resolve('done');
    });
  }

  async determineHashRate() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.hashes = [];
    let curHash = 0;
    const determineRounds = 5;
    const validationInput = this.powService.validationInput;
    for (let i = 0; i < determineRounds; i++) {
      const start = new Date();
      start.setSeconds(start.getSeconds() + 1);
      while (start.getTime() > new Date().getTime()) {
        const hash = this.powService.createHash(
          validationInput[0], validationInput[1], 0, 0);
        if (this.hashes.unshift(hash.id) > ++this.amountOfHashesCreated) {
          this.hashes.pop();
        }
        await delay(1);
      }
      this.amountOfHashesCreated = 0;
      this.hashRate = Math.round(this.hashes.length * 0.75);
      curHash += this.hashRate;
      this.hashes = [];
    }
    this.hashRate = Math.round(curHash / determineRounds);
    this.maxHashRate = this.hashRate;
    this.hashes = [];
    this.isRunning = false;
  }
}
