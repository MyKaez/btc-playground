import { Component, Input } from '@angular/core';
import { User, UserStatus, UserStatusDisplayValues } from 'src/app/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @Input("users") users!: User[];

  getUserStatusDisplayValue(userStatus: UserStatus) {
    return UserStatusDisplayValues[userStatus];
  }
}
