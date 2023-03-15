import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
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
  isExecuting: boolean = false;
  attackingPowerControl = new FormControl(0, [Validators.min(1), Validators.max(99)]);
  inputs: FormGroup = new FormGroup({
    blocksToComplete: new FormControl(15, [Validators.min(1), Validators.max(20)]),
    attackingPower: this.attackingPowerControl,
    preminedBlocks: new FormControl(0, [Validators.min(0), Validators.max(5)]),
    confirmations: new FormControl(3, [Validators.min(0), Validators.max(10)]),
    cancelAttack: new FormControl(1, [Validators.min(0), Validators.max(10)])
  });
  bitcoin: number[] = [];
  attacker: number[] = [];
  clearOnStart: boolean = true;
  contentLayoutMode = ContentLayoutMode.LockImage;

  constructor(private notificationService: NotificationService, public layout: LayoutService,
    private simulationService: SimulationService, private btcService: BtcService) {
    this.inputs.controls['preminedBlocks'].valueChanges.subscribe(value => {
      this.attacker = [];
      this.bitcoin = [];
      let val = Number.parseInt(value);
      for (let i = 0; i < Math.abs(val); i++) {
        if (val < 0) {
          this.bitcoin.push(this.bitcoin.length);
        } else {
          this.attacker.push(this.attacker.length);
        }
      }
    });
    this.isHandset$ = layout.isHandset$;
  }

  isHandset$: Observable<boolean>;
  currentHashRate$ = this.btcService.getCurrentHashRate().pipe(shareReplay(1));
  bitcoinHashRate$ = this.currentHashRate$.pipe(map(rate => this.getSize(rate)));
  totalHashRate$ = combineLatest([this.currentHashRate$, this.attackingPowerControl.valueChanges]).pipe(
    map(([rate, _]) => {
      const totalPower = rate / this.defendingPower;
      return this.getSize(totalPower);
    }));
  attackerHashRate$ = combineLatest([this.currentHashRate$, this.attackingPowerControl.valueChanges]).pipe(
    map(([rate, _]) => {
      const attackingPower = rate / this.defendingPower * this.attackingPower;
      return this.getSize(attackingPower);
    }));

  ngAfterViewInit(): void {
    this.attackingPowerControl.setValue(51);
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

  get totalAmountBlocks() {
    return this.bitcoin.length + this.attacker.length;
  }

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

  get progressBlockchain(): number {
    return this.bitcoin.length / this.blocksToComplete * 100;
  }

  get progressAttackingBlockchain(): number {
    return this.attacker.length / this.blocksToComplete * 100;
  }

  get totalBlocks(): number[] {
    let numbers = [];
    for (let i = 0; i < this.blocksToComplete; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  get bitcoinLead(): number {
    return this.bitcoin.length - this.attacker.length;
  }

  get attackLead(): number {
    return this.attacker.length - this.bitcoin.length;
  }

  isBitcoinLeading(current: number): boolean {
    if (this.bitcoin.length > this.attacker.length) {
      return current + 1 > this.attacker.length;
    }
    return false;
  }

  isAttackerLeading(current: number): boolean {
    if (this.attacker.length > this.bitcoin.length) {
      return current + 1 > this.bitcoin.length;
    }
    return false;
  }

  start() {
    this.isExecuting = true;
    if (this.clearOnStart || this.progressAttackingBlockchain >= 100 || this.progressBlockchain >= 100) {
      this.clear();
    }
    this.addBlockIfNecessary();
    this.simulationService.updateStartSimulation(true);
  }

  stop(): void {
    this.isExecuting = false;
  }

  clear(): void {
    this.bitcoin = [];
    this.attacker = [];
    for (let i = 0; i < this.preminedBlocks; i++) {
      this.attacker.push(this.attacker.length);
    }
  }

  addBlockIfNecessary(): void {
    if (this.bitcoinLead >= this.cancelAttack) {
      this.isExecuting = false;
      this.notificationService.display('Der Angriff wurde abgewehrt!');
    }
    if (this.attackLead >= this.confirmations) {
      this.isExecuting = false;
      this.notificationService.display('Der Angriff war erfolgreich!');
    }
    if (!this.isExecuting) {
      return;
    }

    setTimeout(() => {
      let random = Math.random() * 100;
      let attacking = this.attackingPower;
      console.log(`random: ${random}, attacking: ${attacking}`);
      if (random > attacking) {
        this.bitcoin.push(this.bitcoin.length);
      }
      random = Math.random() * 100;
      let defending = 100 - attacking;
      console.log(`random: ${random}, defending: ${defending}`);
      if (random > defending) {
        this.attacker.push(this.attacker.length);
      }
      this.addBlockIfNecessary();
    }, 400);
  }

  getErrors(control: string) {
    return JSON.stringify(this.inputs.controls[control].errors);
  }
}

