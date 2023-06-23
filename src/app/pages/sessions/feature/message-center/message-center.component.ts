import { Component, Input, OnInit } from '@angular/core';
import { SessionService } from 'src/app/core/session.service';
import { UserService } from 'src/app/core/user.service';
import { Message } from 'src/app/models/message';
import { SessionInfo } from 'src/app/models/session';
import { UserControl } from 'src/app/models/user';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent {

  @Input("session") session!: SessionInfo;
  @Input("user") user?: UserControl;
  @Input("messages") messages!: Message[];

  constructor(private sessionService: SessionService, private userService: UserService) { }

  sendMessage(message: Message): void {
    if (this.user) {
      const subscription = this.userService.sendMessage(this.session.id, this.user, message).subscribe(() => {
        subscription.unsubscribe();
      });
    } else if ('controlId' in this.session) {
      const cast = <any>this.session;
      const sessionControl = { ...this.session, controlId: <string>cast.controlId };
      const subscription = this.sessionService.sendMessage(sessionControl, message).subscribe(() => {
        subscription.unsubscribe();
      });
    }
  }

  isMe(message: Message): boolean {
    return !this.user && this.session.id === message.senderId || this.user?.id === message.senderId;
  }

  getSender(message: Message) {
    if (this.isMe(message)) {
      return 'Me';
    }
    if (this.session.id === message.senderId) {
      return 'Session Host';
    }
    const user = this.session.users.find(u => u.id === message.senderId);
    if (user) {
      return user.name;
    } else {
      return 'unknown sender id: ' + message.senderId;
    }
  }
}
