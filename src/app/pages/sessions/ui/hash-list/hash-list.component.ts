import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Block } from 'src/app/models/block';
import { SessionInfo } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { delay } from 'src/app/shared/delay';
import { SHA256 } from 'crypto-js';

@Component({
  selector: 'app-hash-list',
  templateUrl: './hash-list.component.html',
  styleUrls: ['./hash-list.component.scss']
})
export class HashListComponent {
  @Input("session") session?: SessionInfo;
  @Input("user") user?: User;
  @Output("blockFound") blockFound = new EventEmitter<Block>();

  @Input("go") set go(value: boolean) {
    if (value && this.user?.status == 'ready') {
      this.findBlock().then(block => this.blockFound.emit(block));
    }
  }

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

  blocks: Block[] = [];

  async findBlock(): Promise<Block> {
    let overallHashRate = 0;
    const id = this.user!.id.split('-')[0];
    const timestamp = new Date().toISOString();
    const template = `${id}_${timestamp}_`;
    do {
      overallHashRate++;
      const text = template + overallHashRate;
      const hash = SHA256(text).toString();
      const block = {
        userId: this.user!.id,
        text: text,
        hash: hash
      };
      this.blocks.unshift(block);
      if (this.blocks.length > 20) {
        this.blocks.pop();
      }
      await delay(1);
    } while (this.blocks[0].hash > this.session!.configuration.threshold);
    return this.blocks[0];
  }

  async determine(): Promise<number> {
    let overallHashRate = 0;
    const determineRounds = 5;
    const template = `${this.user!.id}_${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}'_`;
    for (let i = 0; i < determineRounds; i++) {
      const start = new Date();
      start.setSeconds(start.getSeconds() + 1);
      while (start.getTime() > new Date().getTime()) {
        overallHashRate++;
        const text = template + overallHashRate;
        const hash = SHA256(text).toString();
        const block = {
          userId: this.user!.id,
          text: text,
          hash: hash
        };
        this.blocks.unshift(block);
        if (this.blocks.length > 20) {
          this.blocks.pop();
        }
        await delay(1);
      }
      this.blocks = [];
    }
    const allowedHashRate = Math.round(Math.round(overallHashRate * 0.75) / determineRounds);

    return allowedHashRate;
  }
}
