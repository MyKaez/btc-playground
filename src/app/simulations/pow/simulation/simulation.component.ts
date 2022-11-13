import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {delay} from 'src/app/shared/delay';
import {BLOCK_DURATION_IN_SECONDS} from 'src/app/shared/helpers/block';
import {BtcService} from 'src/app/shared/helpers/btc.service';
import {Column} from 'src/app/shared/helpers/interfaces';
import {calculateUnit, UnitOfHash} from 'src/app/shared/helpers/size';
import {calculateTime} from 'src/app/shared/helpers/time';
import {NotificationService} from 'src/app/shared/media/notification.service';
import {PowHash} from './interfaces';
import {PowService} from './pow.service';
import {ContentLayoutMode, LayoutService} from "../../../pages";

@Component({
  selector: 'app-pow-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['../../simulation.component.scss']
})
export class SimulationComponent implements OnInit, OnDestroy {
  public readonly maxAmountOfHashesToShow = 200;
  public readonly minAmountOfHashesToShow = 1;
  private readonly separator = ' | ';

  private cachedHashes: PowHash[] = [];

  inputs: FormGroup;
  hashNo: number = 0;
  executedHashrates: number = 0;
  stopOnFoundBlock: boolean = true;
  clearOnStart: boolean = true;
  blink: boolean = true;
  isExecuting: boolean = true;
  isCalculating: Subject<boolean> = new Subject();
  isProcessing: Subject<boolean> = new Subject();

  constructor(private powService: PowService,
              private notificationService: NotificationService,
              private btcService: BtcService,
              private layout: LayoutService) {
    this.inputs = new FormGroup({
      hashRate: new FormControl(this.powService.hashRate, this.createHashRateValidators(50)),
      externalHashRate: new FormControl(this.powService.externalHashRate,
        [Validators.required, Validators.min(0)]),
      blockTime: new FormControl(this.powService.blockTime,
        [Validators.required, Validators.min(1), Validators.max(3600)])
    });
    this.inputs.get('hashRate')!.valueChanges.subscribe(val => this.powService.hashRate = val);
    this.inputs.get('externalHashRate')!.valueChanges.subscribe(val => this.powService.externalHashRate = val);
    this.inputs.get('blockTime')!.valueChanges.subscribe(val => this.powService.blockTime = val);
    this.isProcessing.subscribe(value => this.toggleAccessibility(value));
    this.isCalculating.subscribe(value => this.toggleAccessibility(value));
    this.isProcessing.next(false);
    this.isCalculating.next(false);
  }

  async ngOnInit() {
    await this.executeBlink();
    this.layout.setLayoutMode(ContentLayoutMode.LockImage);
    this.layout.isSimulation(true);
  }

  ngOnDestroy(): void {
    this.layout.isSimulation(false);
  }

  private toggleAccessibility(value: boolean): void {
    if (value) {
      this.inputs.disable();
    } else {
      this.inputs.enable();
    }
    this.isExecuting = value;
  }

  private createHashRateValidators(maxHashRate: number) {
    return [Validators.required, Validators.min(1), Validators.max(maxHashRate)];
  }

  getErrors(control: string) {
    return JSON.stringify(this.inputs.controls[control].errors);
  }

  private get hashRate(): number {
    return this.inputs.get('hashRate')!.value;
  }

  private set hashRate(value: number) {
    this.inputs.patchValue({'hashRate': value});
  }

  private get blockTime() {
    return this.inputs.get('blockTime')!.value;
  }

  private set blockTime(value: number) {
    this.inputs.patchValue({'blockTime': value});
  }

  private get externalHashRate() {
    return this.inputs.get('externalHashRate')!.value;
  }

  private set externalHashRate(value: number) {
    this.inputs.patchValue({'externalHashRate': value});
  }

  get currentExternalHashrate(): string | undefined {
    const x = calculateUnit(this.externalHashRate, UnitOfHash.hashes);
    return x.toText();
  }

  get currentHashrate(): string | undefined {
    const x = calculateUnit(this.hashRate, UnitOfHash.hashes);
    return x.toText();
  }

  get currentBlockTime(): string | undefined {
    return calculateTime(this.blockTime);
  }

  public get hashes() {
    return this.cachedHashes.filter((_, index) => index < this.amountHashesToShow);
  }

  public get amountHashesToShow(): Number {
    return Number.parseInt(localStorage.getItem('sim_pow_amountHashesToShow') ?? '16');
  }

  public set amountHashesToShow(value: Number) {
    localStorage.setItem('sim_pow_amountHashesToShow', value.toString());
  }

  public get displayedColumns(): string[] {
    return ['id', 'isValid', 'serialNo', 'hashRate'];
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

  public get expectedDuration(): string {
    return this.powService.expectedDuration;
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

  async executeBlink() {
    if (this.isExecuting) {
      this.blink = true;
    } else {
      this.blink = !this.blink;
    }
    setTimeout(async () => await this.executeBlink(), this.blink ? 1000 : 500);
  }

  async start() {
    if (this.isExecuting) {
      return;
    }
    if (this.clearOnStart) {
      this.clear();
    }
    this.isProcessing.next(true);
    await this.createJob();
  }

  async determineHashRate() {
    this.isCalculating.next(true);
    this.clear();
    let overallHashRate = 0;
    const determineRounds = 5;
    const validationInput = this.powService.validationInput;
    for (let i = 0; i < determineRounds; i++) {
      if (!this.isExecuting) {
        break;
      }
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
      overallHashRate += this.hashRate;
      this.cachedHashes = [];
    }
    this.hashRate = Math.round(overallHashRate / determineRounds);
    this.inputs.controls['hashRate'].clearValidators();
    this.inputs.controls['hashRate'].addValidators(this.createHashRateValidators(this.hashRate));
    this.isCalculating.next(false);
    this.clear();
  }

  setBitcoinBlockTime() {
    this.blockTime = BLOCK_DURATION_IN_SECONDS;
  }

  determineExternalHashRate() {
    this.btcService.getLatestBlocks().subscribe(blocks => {
      // https://en.bitcoinwiki.org/wiki/Difficulty_in_Mining#:~:text=Average%20time%20of%20finding%20a,a%20miner%20finds%20per%20second.
      const bitcoinDifficulty = blocks[0].difficulty;
      this.externalHashRate = bitcoinDifficulty * (2 ** 32) / BLOCK_DURATION_IN_SECONDS;
    });
  }

  createJob(): Promise<string> {
    return new Promise(async resolve => {
      const timeToWait = 1000 / this.hashRate;
      const validationInput = this.powService.validationInput;
      while (this.isExecuting) {
        this.executedHashrates++;
        for (let i = 0; i < this.hashRate; i++) {
          if (!this.isExecuting) {
            break;
          }
          const hash = this.powService.createHash(
            validationInput[0], validationInput[1], this.executedHashrates, ++this.hashNo);
          if (this.cachedHashes.unshift(hash) > this.maxAmountOfHashesToShow) {
            this.cachedHashes.pop();
          }
          if (this.stopOnFoundBlock && hash.isValid) {
            this.stop();
            this.notificationService.display('Found hash!');
            break;
          }
          await delay(timeToWait);
        }
      }
      resolve('done');
    });
  }

  stop(): void {
    this.isProcessing.next(false);
  }

  clear(): void {
    if (this.isExecuting) {
      return;
    }
    this.cachedHashes = [];
    this.executedHashrates = 0;
    this.hashNo = 0;
  }
}
