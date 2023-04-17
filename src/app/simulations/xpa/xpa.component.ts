import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { BtcService } from 'src/app/shared/helpers/btc.service';
import { calculateUnit, UnitOfHash } from 'src/app/shared/helpers/size';
import { NotificationService } from 'src/app/shared/media/notification.service';
import { Helper } from 'src/model';
import { NormalizedHashrate } from 'src/model/bitcoin';
import { StringHelper } from 'src/model/text';
import { XpaParticipant, XpaParticipantView } from '..';
import { SimulationService } from '../simulation.service';
import { DOUBLE_SPEND, STATE_ATTACK, Scenario } from './xpa-scenario';

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
  attackingPowerControl = new FormControl({ value: 0, disabled: this.isExecuting }, [Validators.min(1), Validators.max(99), Validators.required]);
  blocksToCompleteControl = new FormControl(15, [Validators.min(0), Validators.max(20), Validators.required]);

  confirmationsControl = new FormControl(5, [Validators.min(0), Validators.max(10), Validators.required]);
  cancelAttackControl = new FormControl(3, [Validators.min(0), Validators.max(10), Validators.required]);
  inputs: FormGroup = new FormGroup({
    blocksToComplete: this.blocksToCompleteControl,
    attackingPower: this.attackingPowerControl,
    preminedBlocks: new FormControl(0, [Validators.min(0), Validators.max(5), Validators.required]),
    confirmations: this.confirmationsControl,
    cancelAttack: this.cancelAttackControl
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
      if (!isNaN(preminedBlocksCount)) {
        //this.minedBlocksBitcoin$.next(preminedBlocksCount);
        this.minedBlocksAttackerSubject.next(preminedBlocksCount);
      }
    });

    this.confirmationsControl.addValidators(this.createValidatorIsMoreThanPremined.bind(this));
    this.isHandset$ = layout.isHandset$;
  }

  set scenario(value: Scenario) {
    this.attackingPowerControl.setValue(value.attackingPower);
    this.blocksToCompleteControl.setValue(value.blocksToComplete);
    this.cancelAttackControl.setValue(value.cancelAttack);
    this.confirmationsControl.setValue(value.confirmations);
    if (this.preminedBlocks > 0) {
      this.minedBlocksAttackerSubject.next(this.preminedBlocks);
    } else if (this.preminedBlocks < 0) {
      this.minedBlocksBitcoinSubject.next(-this.preminedBlocks);
    }
  }

  isHandset$: Observable<boolean>;
  currentHashRate$ = this.btcService.getCurrentHashRate().pipe(shareReplay(1));
  attackingPower$ = combineLatest([this.currentHashRate$, this.attackingPowerControl.valueChanges]).pipe(
    map(([cur, att]) => cur / this.defendingPower * (att ?? 0))
  );
  totalHashRate$ = combineLatest([this.currentHashRate$, this.attackingPower$]).pipe(
    map(([cur, att]) => this.expandHashrateUnit(cur + att))
  );

  bitcoinParticipant$ = combineLatest([this.inputs.valueChanges, this.minedBlocksBitcoin$, this.currentHashRate$, this.minedBlocksAttacker$]).pipe(
    map(([anyInputValue, mined, hashrate, minedByAttacker]) => this.createParticipant("Bitcoin Blockchain", mined, hashrate, "Aktuelle Bitcoin HashRate",
      minedByAttacker)));

  attackerParticipant$ = combineLatest([this.inputs.valueChanges, this.minedBlocksAttacker$, this.attackingPower$, this.minedBlocksBitcoin$]).pipe(
    map(([anyInputValue, mined, hashrate, minedByBitcoin]) => this.createParticipant("Angreifer Blockchain", mined, hashrate, "Aktuelle Angreifer HashRate",
      minedByBitcoin, this.confirmations)));

  participants$ = combineLatest([this.bitcoinParticipant$, this.attackerParticipant$])
    .pipe(map(([bitcoinParticipant, attackerParticipant]) => [bitcoinParticipant, attackerParticipant].map(p => this.createParticipantView(p))));

  ngAfterViewInit(): void {
    this.scenario = DOUBLE_SPEND;
  }

  private createParticipant(title: string, mined: number, hashrate: number, hashrateTitle: string,
    maxMinedByOther: number, confirmations = 0): XpaParticipant {
    return {
      title: title,
      minedBlocks: mined,
      hashrate: this.expandHashrateUnit(hashrate),
      hashrateTitle: hashrateTitle,
      blocksInLead: this.getLead(mined, maxMinedByOther),
      confirmations: confirmations
    };
  }

  private createParticipantView(participant: XpaParticipant): XpaParticipantView {
    let absoluteLead = Math.max(participant.blocksInLead, 0);
    let minedBlocks = participant.minedBlocks;
    if (absoluteLead > 0) minedBlocks -= absoluteLead;
    let leftConfirmations = participant.confirmations - participant.minedBlocks;

    return {
      ... participant,
      blocks: this.getBlocks(minedBlocks),
      stripes: this.getStripes(this.blocksToComplete - absoluteLead),
      confirmationBoxes: this.getBoxes(leftConfirmations, participant.minedBlocks > 0),
      absoluteLead: absoluteLead,
      leadingBlocks: this.getBlocks(participant.blocksInLead, minedBlocks > 0),
      leadingStripes: this.getStripes(absoluteLead)
    };
  }

  private getStripes = (count: number) => StringHelper.renderCharacter("--", count, XpaComponent.maxDisplayCount);

  private getBlocks = (count: number, withStripedPrefix = false) => StringHelper.renderCharacter("██-", count, XpaComponent.maxDisplayCount, true, withStripedPrefix ? "-" : "");

  private getBoxes = (count: number, withStripedPrefix = false) => StringHelper.renderCharacter("▭-", count, XpaComponent.maxDisplayCount, true, withStripedPrefix ? "-" : "");


  expandHashrateUnit(hashRate: number | null): NormalizedHashrate {
    const size = calculateUnit(hashRate ?? 0, UnitOfHash.hashes);
    return {
      value: size.value.toFixed(2),
      unit: size.unit.text
    };
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
    if (this.getFormErrors().length) {
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
    Helper.repeat(400, () => !this.isExecuting, () => {
      let minedBlocksBitcoin = this.minedBlocksBitcoinSubject.getValue();
      let minedBlocksAttacker = this.minedBlocksAttackerSubject.getValue();
      let bitcoinLead = this.getLead(minedBlocksBitcoin, minedBlocksAttacker);
      let attackerLead = this.getLead(minedBlocksAttacker, minedBlocksBitcoin);

      if (bitcoinLead >= this.cancelAttack) {
        this.endExecution('Der Angriff wurde abgewehrt!');
        return;
      }
      else if (attackerLead >= this.cancelAttack && Number.isNaN(this.confirmations)) {
        this.endExecution('Der Angriff war erfolgreich!');
        return;
      }
      else if (attackerLead >= 1 && minedBlocksAttacker >= this.confirmations) {
        this.endExecution('Der Angriff war erfolgreich!');
        return;
      }
      else if (minedBlocksBitcoin >= this.blocksToComplete) {
        this.endExecution('Der Angriff wurde abgebrochen!');
        return;
      }

      let random = Math.random() * 100;
      let attacking = this.attackingPower;
      //console.log(`random: ${random}, attacking: ${attacking}`);
      if (random < attacking) {
        this.minedBlocksAttackerSubject.next(minedBlocksAttacker + 1);
      }

      random = Math.random() * 100;
      let defending = 100 - attacking;
      //console.log(`random: ${random}, defending: ${defending}`);
      if (random < defending) {
        this.minedBlocksBitcoinSubject.next(minedBlocksBitcoin + 1);
      }
    });
  }

  private endExecution(notificationText?: string, hasAttackSucceeded?: boolean) {
    this.isExecuting = false;
    if (notificationText) this.notificationService.display(notificationText);
  }

  /** @todo move this to a service */
  private errorMapping: any = {
    "min": "Der Wert ist zu niedrig.",
    "max": "Der Wert ist zu hoch.",
    "required": "Wert benötigt",
    "isLessThanPremined": "Sollte 0 oder dem Vorsprung entsprechen."
  };

  private createValidatorIsMoreThanPremined(control: AbstractControl): {[key: string]: number} | null {
    let numberValue = Number.parseInt(control.value);
    if(numberValue && numberValue <= this.preminedBlocks) {
      return { isLessThanPremined: this.preminedBlocks };
    }
    
    return null;
  }

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
    catch (error) {
      console.error("Failed validating errors", error);
      return ["Failed validating"];
    }
  }

  doubleSpend() {
    this.clear();
    this.scenario = DOUBLE_SPEND;
  }

  stateAttack() {
    this.clear();
    this.scenario = STATE_ATTACK;
  }
}