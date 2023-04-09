import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, min, Observable, shareReplay, Subject, tap } from 'rxjs';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { BtcService } from 'src/app/shared/helpers/btc.service';
import { calculateUnit, UnitOfHash } from 'src/app/shared/helpers/size';
import { NotificationService } from 'src/app/shared/media/notification.service';
import { SimulationService } from '../simulation.service';

@Component({
  selector: 'app-xpa',
  templateUrl: './xpa.component.html',
  styleUrls: ['./xpa.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class XpaComponent implements AfterViewInit {
  static readonly title = "51% Attacke";
  static readonly maxDisplayCount = 1000;

  isExecuting: boolean = false;
  attackingPowerControl = new FormControl(0, [Validators.min(1), Validators.max(99), Validators.required]);
  inputs: FormGroup = new FormGroup({
    blocksToComplete: new FormControl(15, [Validators.min(1), Validators.max(20), Validators.required]),
    attackingPower: this.attackingPowerControl,
    preminedBlocks: new FormControl(0, [Validators.min(0), Validators.max(5), Validators.required]),
    confirmations: new FormControl(3, [Validators.min(0), Validators.max(10), Validators.required]),
    cancelAttack: new FormControl(1, [Validators.min(0), Validators.max(10), Validators.required])
  });

  minedBlocksBitcoinSubject = new BehaviorSubject(0);
  minedBlocksBitcoin$ = this.minedBlocksBitcoinSubject.asObservable();
  minedBlocksAttackerSubject = new BehaviorSubject(0);
  minedBlocksAttacker$ = this.minedBlocksAttackerSubject.asObservable();
  clearOnStart: boolean = true;
  contentLayoutMode = ContentLayoutMode.LockImage;

  constructor(private notificationService: NotificationService, public layout: LayoutService,
    private simulationService: SimulationService, private btcService: BtcService) {
    this.inputs.controls['preminedBlocks'].valueChanges.subscribe(value => {
      let preminedBlocksCount = Number.parseInt(value);
      if(!isNaN(preminedBlocksCount)) {
        //this.minedBlocksBitcoin$.next(preminedBlocksCount);
        this.minedBlocksAttackerSubject.next(preminedBlocksCount);
      }
    });
    this.isHandset$ = layout.isHandset$;
  }

  isHandset$: Observable<boolean>;
  currentHashRate$ = this.btcService.getCurrentHashRate().pipe(shareReplay(1));
  bitcoinHashRate$ = this.currentHashRate$.pipe(map(rate => this.getSize(rate)));
  attackingPower$ = combineLatest([this.currentHashRate$, this.attackingPowerControl.valueChanges]).pipe(
    map(([cur, att]) => cur / this.defendingPower * (att ?? 0))
  );
  attackerHashRate$ = this.attackingPower$.pipe(map(att => this.getSize(att)));
  totalHashRate$ = combineLatest([this.currentHashRate$, this.attackingPower$]).pipe(
    map(([cur, att]) => this.getSize(cur + att))
  );

  bitcoinParticipant$ = combineLatest([this.minedBlocksBitcoin$, this.bitcoinHashRate$, this.minedBlocksAttacker$]).pipe(
    map(([mined, hashrate, minedByAttacker]) => this.createParticipant("Bitcoin Blockchain", mined, hashrate, "Aktuelle Bitcoin HashRate", minedByAttacker, this.confirmations)), 
    tap(p => console.log("blockhain p", p)));

  attackerParticipant$ = combineLatest([this.minedBlocksAttacker$, this.attackerHashRate$, this.minedBlocksBitcoin$]).pipe(
    map(([mined, hashrate, minedByBitcoin]) => this.createParticipant("Angreifer Blockchain", mined, hashrate, "Aktuelle Angreifer HashRate", minedByBitcoin, this.cancelAttack)));

  participants$ = combineLatest([this.bitcoinParticipant$, this.attackerParticipant$])
    .pipe(map(([bitcoinParticipant, attackerParticipant]) => [bitcoinParticipant, attackerParticipant].map(p => this.createParticipantView(p))), 
    tap(p => console.log("got participant", p)));  

  ngAfterViewInit(): void {
    this.attackingPowerControl.setValue(51);
  }

  private createParticipant(title: string, mined: number, hashrate: string, hashrateTitle: string, maxMinedByOther: number, goal: number): XpaParticipant {
    return {
      title: title,
      minedBlocks: mined,
      hashrate: hashrate,
      hashrateTitle: hashrateTitle,
      blocksInLead: this.getLead(mined, maxMinedByOther),
      goal: goal,
      hashrateUnit: "exahashes"
    };
  }

  private createParticipantView(participant: XpaParticipant): XpaParticipantView {
    let leadingAbsolute = Math.max(participant.blocksInLead, 0); 
    return {
      ... participant,
      blocks: this.getBlocks(participant.minedBlocks),
      stripes: this.getStripes(this.blocksToComplete - leadingAbsolute), // maybe rather take totalBlocks?
      leadingBlocks: this.getBlocks(participant.blocksInLead, true),
      leadingStripes: this.getStripes(leadingAbsolute)
    };
  }

  private getStripes(count: number): string {
    if(count <= 0) return "";
    count = Math.min(XpaComponent.maxDisplayCount, count);

    return "--".repeat(count);
  }

  private getBlocks(count: number, withStripedPrefix = false): string {
    if(count <= 0) return "";
    count = Math.min(XpaComponent.maxDisplayCount, count);

    let text = "██-".repeat(count);
    if(withStripedPrefix) text = "-" + text;
    return text.substring(0, text.length - 1);
  }

  getSize(hashRate: number | null): string {
    const size = calculateUnit(hashRate ?? 0, UnitOfHash.hashes);
    return `${size.value.toFixed(2)} ${size.unit.text}`;
  }

  ngOnDestroy(): void {
    this.layout.isSimulation = false;
    this.stop();
    this.clear();
  }

  totalAmountBlocks$ = combineLatest([this.minedBlocksAttacker$, this.minedBlocksBitcoin$])
    .pipe(map(([attacker, bitcoin]) => attacker + bitcoin));

  get blocksToComplete(): number {
    return Number.parseInt(this.inputs.controls['blocksToComplete'].value);
  }

  get attackingPower(): number {
    return this.attackingPowerControl.value ?? 0;
  }

  get confirmations(): number {
    return Number.parseInt(this.inputs.controls['confirmations'].value);
  }

  get cancelAttack(): number {
    return Number.parseInt(this.inputs.controls['cancelAttack'].value);
  }

  get defendingPower(): number {
    return 100 - this.attackingPower;
  }

  get preminedBlocks(): number {
    return Number.parseInt(this.inputs.controls['preminedBlocks'].value);
  }

  getProgress(minedBlock: number): number {
    return minedBlock / this.blocksToComplete * 100;
  }

  get totalBlocks(): number[] {
    let numbers = [];
    for (let i = 0; i < this.blocksToComplete; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  getLead(minedBlocks: number, maxMinedBlocks: number): number {
    return minedBlocks - maxMinedBlocks;
  }

  isLeading(lead: number) {
    return lead > 0;
  }

  start() {
    if(this.getFormErrors().length) {
      this.notificationService.display("Leider gibt es Fehler in den Einstellungen. Bitte prüfe deine Angaben.");
      return;
    }

    let minedBlocks = [this.minedBlocksBitcoinSubject.getValue(), this.minedBlocksAttackerSubject.getValue()];
    let miningProgress = minedBlocks.map(block => this.getProgress(block));
    this.isExecuting = true;
    if (this.clearOnStart || miningProgress.some(progress => progress >= 100)) {
      this.clear();
    }

    this.addBlockIfNecessary();
    this.simulationService.updateStartSimulation(true);
  }

  stop(): void {
    this.isExecuting = false;
  }

  clear(): void {
    this.minedBlocksBitcoinSubject.next(0);
    this.minedBlocksAttackerSubject.next(this.preminedBlocks);
  }

  addBlockIfNecessary(): void {
    let interval = window.setInterval(() => {
      let minedBlocksBitcoin = this.minedBlocksBitcoinSubject.getValue();
      let minedBlocksAttacker = this.minedBlocksAttackerSubject.getValue();
      let bitcoinLead = this.getLead(minedBlocksBitcoin, minedBlocksAttacker);
      let attackerLead = this.getLead(minedBlocksAttacker, minedBlocksBitcoin);

      if (bitcoinLead >= this.cancelAttack) {
        this.isExecuting = false;
        this.notificationService.display('Der Angriff wurde abgewehrt!');
      }
      if (attackerLead >= this.confirmations) {
        this.isExecuting = false;
        this.notificationService.display('Der Angriff war erfolgreich!');
      }

      if (!this.isExecuting) {
        window.clearInterval(interval);
        return;
      }

      let random = Math.random() * 100;
      let attacking = this.attackingPower;
      //console.log(`random: ${random}, attacking: ${attacking}`);
      if (random > attacking) {
        this.minedBlocksBitcoinSubject.next(minedBlocksBitcoin + 1);
      }
      random = Math.random() * 100;
      let defending = 100 - attacking;
      //console.log(`random: ${random}, defending: ${defending}`);
      if (random > defending) {
        this.minedBlocksAttackerSubject.next(minedBlocksAttacker + 1);
      }
      this.addBlockIfNecessary();
    }, 400);
  }

  /** @todo move this to a service */
  private errorMapping: any = {
    "min": "Der Wert ist zu niedrig.",
    "max": "Der Wert ist zu hoch.",
    "required": "Wert benötigt"
  };

  /** @todo move this to a service */
  getErrors(control: string): string | undefined {
    if (!this.inputs.controls[control].errors) return undefined;
    return Object.keys(this.inputs.controls[control].errors!)
      .map(key => this.errorMapping[key] || key)
      .join(" ");    
  }

  getFormErrors(): string[] {
    try {
      var errors = Object.keys(this.inputs.controls)
        .map(key => this.getErrors(key));
      var filtered = errors.filter((error): error is string => !!error);
      return filtered;
    }
    catch(error) {
      console.error("Failed validating errors", error);
      return ["Failed validating"];
    }
  }
}

export interface XpaParticipant {
  title: string;
  minedBlocks: number;
  blocksInLead: number;
  goal: number;
  hashrate: string;
  hashrateTitle: string;
  hashrateUnit: string;
}

export interface XpaParticipantView extends XpaParticipant {
  blocks: string;
  stripes: string;
  leadingBlocks?: string;
  leadingStripes?: string;
}

