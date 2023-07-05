import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HubConnection } from '@microsoft/signalr';
import { Subject, map, merge, shareReplay, switchMap, tap } from 'rxjs';
import { SuggestionService } from 'src/app/core/suggestion.service';
import { UserService } from 'src/app/core/user.service';
import { SessionInfo } from 'src/app/models/session';
import { User, UserControl } from 'src/app/models/user';
import { HashListComponent } from '../../ui/hash-list/hash-list.component';
import { Block } from 'src/app/models/block';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input("session") session!: SessionInfo;
  @Input("hubConnection") hubConnection!: HubConnection;
  @Input("user") user?: User;
  @Output("userChange") userChange = new EventEmitter<UserControl>();
  @ViewChild("hashList") hashList?: HashListComponent;;

  private userName = new Subject<string>();
  private userId = new Subject<string>();
  private loading = new Subject<boolean>();

  constructor(private userService: UserService, private suggestionService: SuggestionService) {
  }

  userNameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  hashRateControl = new FormControl<number>(0);

  registerUser$ = this.userName.pipe(
    switchMap(userName => this.userService.registerUser(this.session.id, userName)),
    shareReplay(1)
  );
  getUser$ = this.userId.pipe(
    switchMap(id => this.userService.getUsers(this.session.id).pipe(
      map(users => users.find(u => u.id === id)!)
    )),
    map(user => { return { ...<UserControl>this.user, ...user } })
  );
  user$ = merge(this.registerUser$, this.getUser$).pipe(
    tap(user => this.userChange.emit(user)),
    tap(user => this.hubConnection.invoke('RegisterUser', user.id))
  );

  loading$ = this.loading.pipe();

  ngAfterViewInit(): void {
    if (!this.user) {
      this.hubConnection.on(`${this.session.id}:UserUpdate`, user => {
        if (this.user?.id == user.id) {
          this.userId.next(user.id);
        }
      });
      const subscription = this.suggestionService.suggestUser().subscribe(suggestion => {
        this.userNameControl.setValue(suggestion.name);
        subscription.unsubscribe();
      });
    }
  }

  registerUser(): void {
    this.loading.next(true);
    this.userName.next(this.userNameControl.value ?? '');
  }

  ready(): void {
    if (!this.user) {
      return;
    }
    this.user.status = 'ready';
    const config = { hashRate: this.hashRateControl.value ?? 0 };
    const subscription = this.userService.sendUpdate(this.session.id, <UserControl>this.user, config).subscribe(_ => {
      subscription.unsubscribe();
    });
  }

  async determine() {
    if (this.hashList) {
      const hashRate = await this.hashList.powService.determine();
      this.hashRateControl.setValue(hashRate);
      this.ready();
    }
  }

  blockFound(block: Block) {
    const user = <UserControl>this.user;
    user.status = 'done';
    const subscription = this.userService.sendUpdate(this.session.id, <UserControl>this.user, block).subscribe(_ => {
      subscription.unsubscribe();
    })
  }
}
