import { Component, Input, OnInit } from '@angular/core';
import { Block } from 'src/app/models/block';
import { SessionInfo } from 'src/app/models/session';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-done',
  templateUrl: './user-done.component.html',
  styleUrls: ['./user-done.component.scss']
})
export class UserDoneComponent {

  private _winner?: string;

  @Input("session") session?: SessionInfo;
  @Input("user") user?: User;

  get winnerBlock(): Block | undefined {
    return <Block>this.session!.configuration.result;
  }

  get isMe(): boolean {
    return this.user?.id === this.winnerBlock?.userId;
  }

  get winner(): string {
    const notKnown = 'unknown';
    if (this._winner && this._winner !== notKnown) {
      return this._winner;
    }
    const user = this.session!.users.find(u => u.id === this.winnerBlock?.userId);
    return this._winner = user?.name ?? notKnown;
  }
}
