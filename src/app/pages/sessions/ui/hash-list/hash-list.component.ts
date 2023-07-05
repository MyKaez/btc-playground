import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Block } from 'src/app/models/block';
import { SessionInfo } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { PowService } from 'src/app/simulations';

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

  @Input("go") set go(value: boolean) {
    if (value && this.user?.status == 'ready') {
      this.powService.findBlock(this.user.id, this.session!.configuration, 20).then(block => this.blockFound.emit(block));
    }
  }

  hashRateControl = new FormControl<number>(0);

  constructor(public powService: PowService) { }

  get winnerBlock(): Block {
    return <Block>this.session!.configuration.result;
  }

  get isMe(): boolean {
    return this.user?.id === this.winnerBlock.userId;
  }

  get winner(): string {
    const user = this.session!.users.find(u => u.id === this.winnerBlock.userId);
    return user?.name ?? 'unknown';
  }


  async determine() {
    const hashRate = await this.powService.determine(this.user?.id ?? '', 20);
    this.hashRateControl.setValue(hashRate);
    this.determinedHashRate.next(hashRate);
  }

}
