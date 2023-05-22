import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { User } from 'src/model/api';
import { PowOnlineUser } from './pow-online-user';

@Component({
  selector: 'app-pow-online-users',
  templateUrl: './pow-online-users.component.html',
  styleUrls: ['./pow-online-users.component.scss']
})
export class PowOnlineUsersComponent implements OnInit {
  @Input("users") users$?: Observable<PowOnlineUser[]>;

  constructor() { }

  ngOnInit(): void {
  }
}
