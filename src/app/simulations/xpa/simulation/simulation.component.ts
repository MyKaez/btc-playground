import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-xpa-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  isExecuting: boolean = false;
  inputs: FormGroup = new FormGroup({
    blocksToComplete: new FormControl(15, [Validators.min(1), Validators.max(20)]),
    attackingPower: new FormControl(51, [Validators.min(1), Validators.max(99)]),
    preminedBlocks: new FormControl(0, [Validators.min(0), Validators.max(5)])
  });
  blockchain: number[] = [];
  attackingBlockchain: number[] = [];

  constructor() { }

  get blocksToComplete(): number {
    return Number.parseInt(this.inputs.controls['blocksToComplete'].value);
  }

  get attackingPower(): number {
    return Number.parseInt(this.inputs.controls['attackingPower'].value);
  }

  get preminedBlocks(): number {
    return Number.parseInt(this.inputs.controls['preminedBlocks'].value);
  }

  ngOnInit(): void {
  }

  execute() {
    this.isExecuting = true;
    this.blockchain = [];
    this.attackingBlockchain = [];
    for (let i = 0; i < this.preminedBlocks; i++) {
      this.attackingBlockchain.push(this.attackingBlockchain.length);
    }
    this.addBlockIfNecessary();
    this.isExecuting = false;
  }

  addBlockIfNecessary(): void {
    setTimeout(() => {
      let random = Math.random() * 100;
      if (random > this.attackingPower) {
        this.blockchain.push(this.blockchain.length);
        if (this.blockchain.length < this.blocksToComplete) {
          this.addBlockIfNecessary();
        }
      } else {
        this.attackingBlockchain.push(this.attackingBlockchain.length);
        if (this.attackingBlockchain.length < this.blocksToComplete) {
          this.addBlockIfNecessary();
        }
      }
    }, 400)
  }

  getErrors(control: string) {
    return JSON.stringify(this.inputs.controls[control].errors);
  }
}
