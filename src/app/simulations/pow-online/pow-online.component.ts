import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, map, merge, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { BtcService } from 'src/app/shared/helpers/btc.service';
import { BLOCK_DURATION_IN_SECONDS } from 'src/app/shared/helpers/block';
import { calculateUnit, UnitOfHash } from 'src/app/shared/helpers/size';
import { calculateTime } from 'src/app/shared/helpers/time';
import { delay } from 'src/app/shared/delay';
import { SimulationService } from '../simulation.service';
import { SimulationHelper } from '../simulation-container/simulation-helper';
import { PowComponent } from '../pow/pow.component';
import { PowHash } from '../pow/simulation/pow-interfaces';
import { PowService } from '../pow/simulation/pow.service';
import { PowOnlineService } from './pow-online.service';
import { StringHelper } from 'src/model/text';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/model/api';
import { UserCardProps } from 'src/app/shared/container/user-cards/user-cards-props';

@Component({
  selector: 'app-pow-online',
  templateUrl: './pow-online.component.html',
  styleUrls: ['./pow-online.component.scss']
})
export class PowOnlineComponent implements OnInit {
  static readonly title = "Multi-PoW";
  static readonly defaultAmountOfHashesToShow = 20;

  displayedColumns: { prop: string, text: string }[] = [
    { prop: 'no', text: 'Nr.' },
    { prop: 'hash', text: 'Hash' },
    { prop: 'cycle', text: 'Zyklus' },
    { prop: 'isValid', text: 'Valide' }
  ];

  getSessionById$ = this.route.params.pipe(
    map(p => p['id']),
    filter(sessionId => sessionId !== undefined && sessionId !== null),
    switchMap(p => this.powOnlineService.getSession(p).pipe(
      catchError(error => {
        if (error.status === 404) {
          this.router.navigate(['/session']);
          return of(undefined);
        } else {
          throw error;
        }
      })
    ))
    //, tap(_ => this.type = 'user-action')
  );

  currentSession$ = merge(this.powOnlineService.lastCreatedSession$, this.getSessionById$);
  participants$ = this.currentSession$.pipe(
    map(session => session?.users?.map(this.createUserCardProps) || [])
  )

  private createUserCardProps(user: User): UserCardProps {
    return {
      title: user.name,
      id: user.id,
      className: user.status
    };
  }

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

  constructor(public layout: LayoutService, private btcService: BtcService, 
    private powService: PowService, private simulationService: SimulationService,
    private powOnlineService: PowOnlineService, private route: ActivatedRoute, private router: Router) {
    this.isHandset$ = layout.isHandset$;
  }

  ngOnInit(): void {
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
  probability$ = merge(this.totalHashRate$, this.blockTimeChanges$).pipe(
    filter(_ => this.totalHashRate > 0),
    map(_ => 1 / (this.totalHashRate * (this.blockTime.value ?? 0))),
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

  async determineHashRate(helper: SimulationHelper) {
    helper.before();
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
    helper.after();
  }

  setBitcoinBlockTime() {
    this.blockTime.setValue(BLOCK_DURATION_IN_SECONDS);
  }

  determineExternalHashRate() {
    this.btcService.getCurrentHashRate().subscribe(rate => this.externalHashRate.setValue(rate));
  }

  toggleStartStop(probability: number) {
    if(this.isExecuting) this.stop();
    else this.start(probability);
  }

  create() {
    this.powOnlineService.createSession(StringHelper.createGuid());
  }

  join() {

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
