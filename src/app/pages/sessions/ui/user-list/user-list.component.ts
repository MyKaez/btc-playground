import { Component, Input } from '@angular/core';
import { Session, SessionControlInfo, SessionInfo } from 'src/app/models/session';
import { User, UserStatus, UserStatusDisplayValues } from 'src/app/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @Input("users") users!: User[];
  @Input("session") session!: SessionInfo;

  getUserStatusDisplayValue(userStatus: UserStatus) {
    return UserStatusDisplayValues[userStatus];
  }

  get showResults() {
    return this.session.status === 'started' || this.session.status === 'stopped'
  }
}

export interface UserListEntry extends User {
  configuration: UserListEntryState;
}

export interface UserListEntryState {
  hashRate?: string;
  userId?: string;
  text?: string;
  hash?: string;
  isValid?: boolean;
}