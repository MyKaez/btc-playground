import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent {

  @Input("senderId") senderId!: string;
  @Output("messageSend") messageSend = new EventEmitter<Message>();

  messageControl = new FormControl('', [Validators.required]);

  sendMessage() {
    const text = this.messageControl.value ?? '';
    const message = {
      senderId: this.senderId,
      text: text
    };
    this.messageSend.next(message);
    this.messageControl.setValue('');
  }
}
