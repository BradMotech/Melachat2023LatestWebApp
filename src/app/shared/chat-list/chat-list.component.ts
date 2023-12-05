import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUsersInterface } from '../Interfaces/IUsersInterface';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent {
@Input() friends:IUsersInterface[] | undefined;
@Output() chatEmitter = new EventEmitter<IUsersInterface>();

startChatting(friend:IUsersInterface){
  this.chatEmitter.emit(friend);
}

}
