import { Component } from '@angular/core';
import { delay } from 'src/app/shared/delay';
import { PowService } from 'src/app/simulations/pow/pow.service';
import { SimpleViewComponent } from '../simple-view.component';

@Component({
  selector: 'app-simple-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['../simple-view.component.scss', '../../materials.scss', '../../app.component.scss']
})
export class PowComponent {
  private powService: PowService;
  private isRunning: boolean;
  public hashes: string[];

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
    await this.createJob();
  }

  createJob(): Promise<string> {
    return new Promise(async resolve => {
      while (this.isRunning) {
        const timeToWait = 1000 / this.hashRate;
        const validationInput = this.validationInput;
        for (let i = 0; i < this.hashRate; i++) {
          const block = this.powService.createBlock(
            validationInput[0], validationInput[1], 0, 0);
          this.hashes.push(block.id);
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
}
