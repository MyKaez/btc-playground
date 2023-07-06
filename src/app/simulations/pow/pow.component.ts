import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, merge, Observable, shareReplay, switchMap } from 'rxjs';
import { BtcService } from 'src/app/shared/helpers/btc.service';
import { BLOCK_DURATION_IN_SECONDS } from 'src/app/shared/helpers/block';
import { calculateUnit, UnitOfHash } from 'src/app/shared/helpers/size';
import { calculateTime } from 'src/app/shared/helpers/time';
import { SimulationService } from '../simulation.service';
import { SimulationHelper } from '../simulation-container/simulation-helper';
import { Block } from 'src/app/models/block';
import { PowService } from './simulation/pow.service';
import { PowConfig } from './models/pow-config';
import { NotificationService } from 'src/app/shared/media/notification.service';

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
    { prop: 'text', text: 'Text' },
    { prop: 'hash', text: 'Hash' },
    { prop: 'isValid', text: 'Valide' }
  ]
  hashRate = new FormControl<number>(0, [Validators.min(1), Validators.max(50)]);
  externalHashRate = new FormControl<number>(0, [Validators.min(0)]);
  blockTime = new FormControl<number>(0, [Validators.min(1)]);
  amountOfBlocks = new FormControl(PowComponent.defaultAmountOfHashesToShow, [Validators.min(1), Validators.max(200)]);
  stopOnFoundBlock = new FormControl<boolean>(true);
  clearOnStart = new FormControl<boolean>(true);
  formGroup = new FormGroup({
    hashRate: this.hashRate,
    externalHashRate: this.externalHashRate,
    blockTime: this.blockTime
  });

  contentLayoutMode = ContentLayoutMode.LockImage;
  hashCount = 0;
  executedCycles = 0;
  blocks: Block[] = this.powService.blocks;

  get totalHashRate(): number {
    return (this.hashRate.value ?? 0) + (this.externalHashRate.value ?? 0);
  }

  constructor(public layout: LayoutService, public powService: PowService, private btcService: BtcService, private simulationService: SimulationService, private notificationService: NotificationService) {
    this.isHandset$ = layout.isHandset$;
  }

  isHandset$: Observable<boolean>;
  hashRateChanges$ = this.hashRate.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    shareReplay(1),
  );
  externalHashRateChanges$ = this.externalHashRate.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    shareReplay(1),
  );
  blockTimeChanges$ = this.blockTime.valueChanges.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    shareReplay(1),
  );
  currentHashRate$ = this.hashRateChanges$.pipe(map(hashRate => this.getSize(hashRate)));
  currentExternalHashRate$ = this.externalHashRateChanges$.pipe(map(hashRate => this.getSize(hashRate)));
  totalHashRate$ = merge(this.hashRateChanges$, this.externalHashRateChanges$).pipe(
    map(_ => this.getSize(this.totalHashRate)),
    shareReplay(1)
  );
  incorrectHashRate$ = this.totalHashRate$.pipe(
    map(_ => this.totalHashRate > 0 ? '' : 'HashRate muss größer 0 sein')
  );

  config$ = combineLatest([this.totalHashRate$, this.blockTimeChanges$]).pipe(
    switchMap(([totalHashRate, blockTime]) => this.powService.getConfig(this.totalHashRate, this.blockTime.value ?? 0))
  );

  probability$ = this.config$.pipe(map(config => config.expected));
  difficulty$ = this.config$.pipe(map(config => config.difficulty));
  threshold$ = this.config$.pipe(map(config => config.threshold));

  currentBlockTime$ = this.blockTimeChanges$.pipe(
    map(time => calculateTime(time ?? 0)),
    shareReplay(1)
  );
  expectedDuration$ = merge(this.hashRateChanges$, this.externalHashRateChanges$, this.blockTimeChanges$).pipe(
    map(_ => {
      let time = this.totalHashRate * (this.blockTime.value ?? 0) / (this.hashRate.value ?? 0);
      return calculateTime(time)
    })
  );

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

  async determineHashRate(helper: SimulationHelper) {
    helper.before();
    const hashRate = await this.powService.determine('', this.amountOfBlocks.value ?? 0);
    this.hashRate.clearValidators();
    this.hashRate.addValidators([Validators.min(1), Validators.max(hashRate)]);
    this.hashRate.setValue(hashRate)
    helper.after();
  }

  setBitcoinBlockTime() {
    this.blockTime.setValue(BLOCK_DURATION_IN_SECONDS);
  }

  determineExternalHashRate() {
    this.btcService.getCurrentHashRate().subscribe(rate => this.externalHashRate.setValue(rate));
  }

  toggleStartStop(config: PowConfig) {
    if (this.powService.isExecuting)
      this.stop();
    else
      this.start(config);
  }

  async start(config: PowConfig) {
    this.powService.isExecuting = true;
    if (this.clearOnStart.value) {
      this.clear();
    }
    let loadCreateJob = this.powService.findBlock('', config, this.amountOfBlocks.value ?? 0);
    this.simulationService.updateStartSimulation(true);
    const block = await loadCreateJob
    if (block) {
      this.notificationService.display('Found hash: ' + block.hash);
    }
  }

  clear() {
    this.executedCycles = 0;
    this.hashCount = 0;
    this.blocks.length = 0;
  }

  stop() {
    this.powService.isExecuting = false;
  }
}
