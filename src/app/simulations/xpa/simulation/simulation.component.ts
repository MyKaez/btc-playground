import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';
import { NotificationService } from 'src/app/shared/media/notification.service';

@Component({
  selector: 'app-xpa-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  isExecuting: boolean = false;
  inputs: FormGroup;
  blockchain: number[] = [];
  attackingBlockchain: number[] = [];
  clearOnStart: boolean = true;

  constructor(private layout: LayoutService, private notificationService: NotificationService) {
    this.inputs = new FormGroup({
      blocksToComplete: new FormControl(15, [Validators.min(1), Validators.max(20)]),
      attackingPower: new FormControl(51, [Validators.min(1), Validators.max(99)]),
      preminedBlocks: new FormControl(0, [Validators.min(0), Validators.max(5)]),
      confirmations: new FormControl(6, [Validators.min(0), Validators.max(10)]),
      cancelAttack: new FormControl(3, [Validators.min(0), Validators.max(10)])
    });
    this.inputs.controls['preminedBlocks'].valueChanges.subscribe(value => {
      this.attackingBlockchain = [];
      this.blockchain = [];
      let val = Number.parseInt(value);
      for (let i = 0; i < Math.abs(val); i++) {
        if (val < 0) {
          this.blockchain.push(this.blockchain.length);
        } else {
          this.attackingBlockchain.push(this.attackingBlockchain.length);
        }
      }
    });
  }

  get totalAmountBlocks() {
    return this.blockchain.length + this.attackingBlockchain.length;
  }

  get blocksToComplete(): number {
    return Number.parseInt(this.inputs.controls['blocksToComplete'].value);
  }

  get attackingPower(): number {
    return Number.parseInt(this.inputs.controls['attackingPower'].value);
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
    return this.blockchain.length / this.blocksToComplete * 100;
  }

  get progressAttackingBlockchain(): number {
    return this.attackingBlockchain.length / this.blocksToComplete * 100;
  }

  get probabilityBlockchain(): string {
    return 'Formel?!';
  }

  get probabilityAttackingBlockchain(): string {
    return 'Formel?!';
  }

  get totalBlocks(): number[] {
    let numbers = [];
    for (let i = 0; i < this.blocksToComplete; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.ImageCarousel);
  }

  start() {
    this.isExecuting = true;
    if (this.clearOnStart || this.progressAttackingBlockchain >= 100 || this.progressBlockchain >= 100) {
      this.clear();
    }
    this.addBlockIfNecessary();
  }

  stop(): void {
    this.isExecuting = false;
  }

  clear(): void {
    this.blockchain = [];
    this.attackingBlockchain = [];
    for (let i = 0; i < this.preminedBlocks; i++) {
      this.attackingBlockchain.push(this.attackingBlockchain.length);
    }
  }

  addBlockIfNecessary(): void {
    setTimeout(() => {
      if (this.blockchain.length > this.confirmations) {
        if ((this.blockchain.length - this.attackingBlockchain.length) >= this.cancelAttack) {
          this.isExecuting = false;
          this.notificationService.display('Bitcoin hat gewonnen!');
        }
      }
      if (!this.isExecuting) {
        return;
      }
      let random = Math.random() * 100;
      if (random > this.attackingPower) {
        this.blockchain.push(this.blockchain.length);
        if (this.blockchain.length < this.blocksToComplete) {
          this.addBlockIfNecessary();
        } else {
          this.isExecuting = false;
          this.notificationService.display('Bitcoin hat gewonnen!');
        }
      } else {
        this.attackingBlockchain.push(this.attackingBlockchain.length);
        if (this.attackingBlockchain.length < this.blocksToComplete) {
          this.addBlockIfNecessary();
        } else {
          this.isExecuting = false;
          this.notificationService.display('Bitcoin hat verloren!');
        }
      }
    }, 400)
  }

  getErrors(control: string) {
    return JSON.stringify(this.inputs.controls[control].errors);
  }
}
