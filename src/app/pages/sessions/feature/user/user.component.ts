import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HubConnection } from '@microsoft/signalr';
import { EMPTY, Subject, catchError, map, merge, shareReplay, switchMap, tap } from 'rxjs';
import { SuggestionService } from 'src/app/core/suggestion.service';
import { UserService } from 'src/app/core/user.service';
import { Block } from 'src/app/models/block';
import { SessionInfo } from 'src/app/models/session';
import { User, UserControl, UserStatus, UserStatusDisplayValues } from 'src/app/models/user';
import { NotificationService } from 'src/app/shared/media/notification.service';

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

  private userName = new Subject<string>();
  private loading = new Subject<boolean>();

  constructor(private userService: UserService, private suggestionService: SuggestionService, private notificationService: NotificationService) {
  }

  getUserNameInitials(name?: string): string | undefined {
    return name?.split(" ")
      .filter(part => part)
      .slice(0, 2)
      .map(part => part[0])
      .join("");
  }

  getUserStatusDisplayValue(userStatus: UserStatus) {
    return UserStatusDisplayValues[userStatus];
  }

  userNameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  registerUser$ = this.userName.pipe(
    switchMap(userName => this.userService.registerUser(this.session.id, userName).pipe(
      catchError(error => {
        this.loading.next(false);
        this.notificationService.display("Da hat etwas nicht geklappt - bitte noch mal probieren!");
        console.error(error);
        return EMPTY;
      })
    )),
    shareReplay(1)
  );

  user$ = this.registerUser$.pipe(
    tap(user => this.userChange.emit(user)),
    tap(user => this.hubConnection.invoke('RegisterUser', user.id))
  );

  loading$ = this.loading.pipe();

  ngAfterViewInit(): void {
    if (!this.user) {
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

  determinedHashRate(hashRate: number) {
    if (!this.user) {
      return;
    }
    const config = { hashRate: hashRate };
    this.user.status = 'ready';
    const subscription = this.userService.sendUpdate(this.session.id, <UserControl>this.user, config).subscribe(_ => {
      subscription.unsubscribe();
    });
  }

  blockFound(block: Block) {
    const user = <UserControl>this.user;
    user.status = 'done';
    const subscription = this.userService.sendUpdate(this.session.id, <UserControl>this.user, block).subscribe(_ => {
      subscription.unsubscribe();
    })
  }
}
