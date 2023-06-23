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

  connect(vm: ViewModel, messageUpdate: (messages: Message[]) => void) {
    const con = vm.connection;
    const session = vm.session;
    const updateUsers = () => {
      console.log('updating users');
      const subscription = this.userService.getUsers(session.id).subscribe(users => {
        session.users = users;
        vm.onUsersUpdate();
        subscription.unsubscribe();
      });
    };

    con.start().then(() => {
      console.log('connection started');

      updateUsers();

      con.invoke('RegisterSession', vm.session.id);

      con.on(`${session.id}:CreateSession`, session => console.log('Created session: ' + session.id));

      con.on(`${session.id}:SessionUpdate`, update => {
        console.log('UpdateSession');
        session.status = update.status;
        session.configuration = update.configuration;
        updateUsers();
        messageUpdate([{ senderId: update.id, text: `status update:  ${update.status}` }]);
      });

      con.on(`${session.id}:CreateUser`, user => {
        console.log('CreateUser: ' + user.id);
        updateUsers();
      });

      con.on(`${session.id}:DeleteUser`, userId => {
        console.log('DeleteUser');
        if (vm.user?.id == userId) {
          vm.user = undefined;
        }
        if (session.users.find(user => user.id === userId)) {
          updateUsers();
        } else {
          console.log('No user found');
        }
      });

      con.on(`${session.id}:UserUpdate`, update => {
        console.log('UserUpdate');
        const user = session.users.find(u => u.id == update.id);
        if (user) {
          if (vm.user?.id == user?.id) {
            vm.user = { ...vm.user, ...user };
          }
          updateUsers();
          messageUpdate([{ senderId: user.id, text: `user update: ${user.status}` }]);
        } else {
          console.log('No user found');
          messageUpdate([{ senderId: '???', text: 'cannot handle UserUpdate: ' + JSON.stringify(update) }]);
        }
      });

      con.on(`${session.id}:UserMessage`, message => {
        console.log('UserMessage');
        if ('senderId' in message && 'text' in message) {
          messageUpdate([message]);
        } else {
          messageUpdate([{ senderId: '???', text: 'cannot handle UserMessage: ' + JSON.stringify(message) }]);
        }
      });

    })
      .catch((err) => console.log('error while establishing signalr connection: ' + err));
  }
}
