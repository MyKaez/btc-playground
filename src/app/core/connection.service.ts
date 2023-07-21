import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { UserService } from './user.service';
import { Message } from '../models/message';
import { ViewModel } from '../models/view-model';

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
    const updateUsers = () => {
      console.log('updating users');
      const subscription = this.userService.getUsers(session.id).subscribe(users => {
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

      updateUsers();

      con.on(`${session.id}:SessionUpdate`, update => {
        console.log('UpdateSession');
        session.status = update.status;
        session.startTime = update.startTime ? new Date(update.startTime) : undefined;
        session.endTime = update.endTime ? new Date(update.endTime) : undefined;
        session.configuration = update.configuration;
        if (update.urgent) {
          updateUsers();
        }
      });

      con.on(`${session.id}:UserUpdates`, (update?: { urgent: boolean }) => {
        console.log('UserUpdates');
        updateUsers();
      });
    })
      .catch((err) => console.log('error while establishing signalr connection: ' + err));
  }
}
