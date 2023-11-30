import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUsersInterface } from '../Interfaces/IUsersInterface';

@Component({
  selector: 'app-new-friend-card',
  templateUrl: './new-friend-card.component.html',
  styleUrls: ['./new-friend-card.component.scss']
})
export class NewFriendCardComponent {
  @Input() users!:IUsersInterface;
  @Output() moreDetailsEmitter = new EventEmitter<IUsersInterface>();
  @Output() MessageUserEmitter = new EventEmitter<IUsersInterface>();


  moreDetails(details: IUsersInterface) {
  this.moreDetailsEmitter.emit(details)
  }

  message(user: IUsersInterface) {
  this.MessageUserEmitter.emit(user)
  }
}
