import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, merge, Observable, of, shareReplay, tap } from 'rxjs';
import { BtcService } from 'src/app/shared/helpers/btc.service';
import { BLOCK_DURATION_IN_SECONDS } from 'src/app/shared/helpers/block';
import { calculateUnit, UnitOfHash } from 'src/app/shared/helpers/size';
import { PowHash } from './simulation/pow-interfaces';
import { PowService } from './simulation/pow.service';
import { calculateTime } from 'src/app/shared/helpers/time';
import { delay } from 'src/app/shared/delay';
import { SimulationService } from '../simulation.service';

@Component({
  selector: 'app-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['./pow.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PowComponent implements AfterViewInit {
  static readonly title = "Proof of Work";
  static readonly defaultAmountOfHashesToShow = 20;

  displayedColumns: { prop: string, text: string }[] = [
    { prop: 'no', text: 'Nr.' },
    { prop: 'hash', text: 'Hash' },
    { prop: 'cycle', text: 'Zyklus' },
    { prop: 'isValid', text: 'Valide' }
  ]
  hashRate = new FormControl<number>(0, [Validators.min(1), Validators.max(50)]);
  externalHashRate = new FormControl<number>(0, [Validators.min(0)]);
  blockTime = new FormControl<number>(0, [Validators.min(1)]);
  amountOfHashes = new FormControl(PowComponent.defaultAmountOfHashesToShow, [Validators.min(1), Validators.max(200)]);
  stopOnFoundBlock = new FormControl<boolean>(true);
  clearOnStart = new FormControl<boolean>(true);
  formGroup = new FormGroup({
    hashRate: this.hashRate,
    externalHashRate: this.externalHashRate,
    blockTime: this.blockTime
  });

  hashes: PowHash[] = [];
  contentLayoutMode = ContentLayoutMode.LockImage;
  isExecuting = false;
  hashCount = 0;
  executedCycles = 0;

  get totalHashRate(): number {
    return (this.hashRate.value ?? 0) + (this.externalHashRate.value ?? 0);
  }

  constructor(public layout: LayoutService, private btcService: BtcService, private powService: PowService, private simulationService: SimulationService) {
    this.isHandset$ = layout.isHandset;
  }

  isHandset$: Observable<boolean>;
  hashRateChanges$ = this.hashRate.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    shareReplay(1),
    filter(_ => this.hashRate.valid)
  );
  externalHashRateChanges$ = this.externalHashRate.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    shareReplay(1),
    filter(_ => this.hashRate.valid)
  );
  blockTimeChanges$ = this.blockTime.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    shareReplay(1),
    filter(_ => this.hashRate.valid)
  );
  currentHashRate$ = this.hashRateChanges$.pipe(map(hashRate => this.getSize(hashRate)));
  currentExternalHashRate$ = this.externalHashRateChanges$.pipe(map(hashRate => this.getSize(hashRate)));
  totalHashRate$ = merge(this.hashRateChanges$, this.externalHashRateChanges$).pipe(
    map(_ => this.getSize(this.totalHashRate)),
    shareReplay(1)
  );
  probability$ = merge(this.totalHashRate$, this.blockTimeChanges$).pipe(
    map(_ => 1 / (((this.hashRate.value ?? 0) + (this.externalHashRate.value ?? 0)) * (this.blockTime.value ?? 0))),
    shareReplay(1)
  );
  difficulty$ = this.probability$.pipe(map(probability => 1 / probability));
  currentBlockTime$ = this.blockTime.valueChanges.pipe(
    map(time => calculateTime(time ?? 0)),
    shareReplay(1)
  );
  expectedPrefix$ = this.probability$.pipe(map(probability => this.powService.expectedPrefix(probability)));
  expectedDuration$ = merge(this.hashRateChanges$, this.externalHashRateChanges$, this.blockTimeChanges$).pipe(
    map(_ => {
      let time = this.totalHashRate * (this.blockTime.value ?? 0) / (this.hashRate.value ?? 0);
      return calculateTime(time)
    })
  );
  hexaDecimalFormula$ = this.probability$.pipe(map(probability => this.powService.hexaDecimalFormula(probability)));

  ngAfterViewInit(): void {
    this.hashRate.setValue(50);
    this.externalHashRate.setValue(0);
    this.blockTime.setValue(10);
  }

  getSize(hashRate: number | null): string {
    const size = calculateUnit(hashRate ?? 0, UnitOfHash.hashes);
    return `${size.value.toFixed(2)} ${size.unit.text}`;
  }

  getValue(hash: any, prop: string) {
    return hash[prop];
  }

  async determineHashRate() {
    this.isExecuting = true;
    let overallHashRate = 0;
    const determineRounds = 5;
    for (let i = 0; i < determineRounds; i++) {
      const start = new Date();
      start.setSeconds(start.getSeconds() + 1);
      while (start.getTime() > new Date().getTime()) {
        overallHashRate++;
        this.createHash(0, i, overallHashRate++);
        await delay(1);
      }
      this.hashes = [];
    }
    const allowedHashRate = Math.round(Math.round(overallHashRate * 0.75) / determineRounds);
    this.hashRate.clearValidators();
    this.hashRate.addValidators([Validators.min(1), Validators.max(allowedHashRate)]);
    this.hashRate.setValue(allowedHashRate)
    this.isExecuting = false;
  }

  setBitcoinBlockTime() {
    this.blockTime.setValue(BLOCK_DURATION_IN_SECONDS);
  }

  determineExternalHashRate() {
    this.btcService.getLatestBlocks().subscribe(blocks => {
      // https://en.bitcoinwiki.org/wiki/Difficulty_in_Mining#:~:text=Average%20time%20of%20finding%20a,a%20miner%20finds%20per%20second.
      const bitcoinDifficulty = blocks[0].difficulty;
      this.externalHashRate.setValue(bitcoinDifficulty * (2 ** 32) / BLOCK_DURATION_IN_SECONDS);
    });
  }

  async start(probability: number) {
    this.isExecuting = true;
    if (this.clearOnStart.value) {
      this.clear();
    }
    let loadCreateJob = this.createJob(probability);
    this.simulationService.updateStartSimulation(true);
    const hash = await loadCreateJob;
    if (hash.isValid) {
      alert('Fround hash: ' + hash.hash);
    }
  }

  createJob(probability: number): Promise<PowHash> {
    return new Promise(async resolve => {
      const hashRate = this.hashRate.value!;
      const timeToWait = 1000 / hashRate;
      let hash!: PowHash;
      while (this.isExecuting) {
        this.executedCycles++;
        for (let i = 0; i < hashRate; i++) {
          hash = this.createHash(probability, this.executedCycles, ++this.hashCount);
          if ((hash.isValid || !this.isExecuting) && this.stopOnFoundBlock.value) {
            this.stop();
            break;
          }
          await delay(timeToWait);
        }
      }
      resolve(hash);
    });
  }

  createHash(probability: number, executedCycles: number, hashCount: number): PowHash {
    const hash = this.powService.createHash(probability, executedCycles, hashCount);
    hash.hash = hash.hash.substring(0, 20) + '[...]';
    let pops = this.hashes.unshift(hash) - (this.amountOfHashes.value ?? 0);
    for (let i = 0; i < pops; i++) {
      this.hashes.pop();
    }
    return hash;
  }

  clear() {
    this.executedCycles = 0;
    this.hashCount = 0;
    this.hashes = [];
  }

  stop() {
    this.isExecuting = false;
  }
}
