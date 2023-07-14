import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Block } from 'src/app/models/block';
import { SessionInfo } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { PowService } from 'src/app/simulations';
import { DeterminationRunConfig, RunConfig } from 'src/app/simulations/pow/models/run-config';

@Component({
  selector: 'app-hash-list',
  templateUrl: './hash-list.component.html',
  styleUrls: ['./hash-list.component.scss']
})
export class HashListComponent {
  @Input("session") session?: SessionInfo;
  @Input("user") user?: User;
  @Output("determinedHashRate") determinedHashRate = new EventEmitter<number>();
  @Output("blockFound") blockFound = new EventEmitter<Block>();

  @Input("clear") set clear(value: boolean) {
    if (value && this.session?.status === 'notStarted') {
      this.powService.blocks.length = 0;
    }
  }

  @Input("go") set go(value: boolean) {
    if (value && this.user?.status === 'ready') {
      const runConfig: RunConfig = {
        runId: this.user.id,
        amountOfBlocks: 20,
        powConfig: this.session!.configuration,
        stopCondition: () => this.session!.status !== 'started'
      }
      this.powService.findBlock(runConfig).then(block => this.blockFound.emit(block));
    }
  }

  hashRateControl = new FormControl<number>(0);

  constructor(public powService: PowService) { }

  async determine() {
    const runConfig: DeterminationRunConfig = {
      runId: this.user?.id ?? '',
      amountOfBlocks: 20,
      stopCondition: () => this.session!.status !== 'preparing'
    }
    const hashRate = await this.powService.determine(runConfig);
    this.hashRateControl.setValue(hashRate);
    this.determinedHashRate.next(hashRate);
  }
}
