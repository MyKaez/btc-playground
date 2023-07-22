import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { UserService } from './user.service';
import { ViewModel } from '../models/view-model';
import { EMPTY, catchError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(@Inject('BTCIS.ME-API') private url: string, private userService: UserService) { }

  createConnection(): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(`${this.url}/sessions-hub`)
      .build();

    return connection;
  }

  connect(vm: ViewModel) {
    const con = vm.connection;
    const session = vm.session;

    con.onclose(async err => {
      if (err) {
        console.log('connection closed, trying to reconnect:' + err);
        await con.start();
      } else {
        console.log('connection closed');
      }
    });

    con.start().then(() => {
      console.log('connection started');
      con.invoke('RegisterSession', vm.session.id);

      this.updateUsers(vm);

      con.on(`${session.id}:SessionUpdate`, update => {
        console.log('SessionUpdate');
        session.status = update.status;
        session.startTime = update.startTime ? new Date(update.startTime) : undefined;
        session.endTime = update.endTime ? new Date(update.endTime) : undefined;
        session.configuration = update.configuration;
        if (update.urgent) {
          this.updateUsers(vm);
        }
      });

      con.on(`${session.id}:UserUpdates`, () => {
        console.log('UserUpdates');
        this.updateUsers(vm);
      });
    }).catch((err) => console.log('error while establishing signalr connection: ' + err));
  }

  private updateUsers(vm: ViewModel, count?: number) {
    console.log('updating users');
    const session = vm.session;
    const subscription = this.userService.getUsers(session.id).pipe(
      catchError(err => {
        console.error('error while getting users: ' + err);
        delay(100);
        if (!count) {
          count = 1;
        } else if (count++ >= 3) {
          throw err;
        }
        this.updateUsers(vm, count);
        return EMPTY;
      }),
    ).subscribe(users => {
      session.users = users;
      const user = users.find(u => u.id == vm.user?.id);
      if (user && vm.user) {
        vm.user.configuration = user.configuration;
        vm.user.status = user.status;
      }
      vm.onUsersUpdate();
      subscription.unsubscribe();
    });
  };
}
