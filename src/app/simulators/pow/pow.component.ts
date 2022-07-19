import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { delay } from 'src/app/shared/delay';
import { PowBlock } from './pow.block';
import { PowService } from './pow.service';

@Component({
  selector: 'app-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['./pow.component.scss']
})
export class PowComponent implements OnInit {
  private blockNo: number;
  private powService: PowService;

  public isProcessing: boolean;
  public blocks: PowBlock[];
  public dataSource: MatTableDataSource<PowBlock>;
  public executedHashrates: number;
  public stopOnFoundBlock: boolean;

  constructor() {
    this.blockNo = 0;
    this.executedHashrates = 0;
    this.blocks = [];
    this.isProcessing = false;
    this.stopOnFoundBlock = true;
    this.powService = new PowService();
    this.dataSource = new MatTableDataSource(this.blocks);
  }

  public get displayedColumns(): string[] {
    return ['id', 'isValid', 'serialNo', 'hashRate', 'difficulty'];
  }

  public get hashRate(): number {
    return this.powService.hashRate;
  }

  public set hashRate(value: number) {
    if (value <= 0 || Number.isNaN(value)) {
      return;
    }
    this.powService.hashRate = value;
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
    this.isProcessing = true;
    await this.createJob();
  }

  createJob(): Promise<string> {
    return new Promise(async resolve => {
      const timeToWait = 1000 / this.hashRate;
      const validationInput = this.powService.getValidationInput();
      while (this.isProcessing) {
        for (let i = 0; i < this.hashRate; i++) {
          const block = this.powService.createBlock(
            validationInput[0], validationInput[1], this.executedHashrates, ++this.blockNo);
          this.blocks.push(block);
          this.dataSource.data = this.blocks.reverse().filter((_, i) => i <= 50);
          if (this.stopOnFoundBlock && block.isValid) {
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

  stop(): void {
    this.isProcessing = false;
  }

  clear(): void {
    if (this.isProcessing) {
      return;
    }
    this.blocks = [];
    this.dataSource.data = this.blocks;
    this.executedHashrates = 0;
    this.blockNo = 0;
  }
}
