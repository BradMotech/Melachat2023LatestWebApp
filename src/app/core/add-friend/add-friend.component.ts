import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent {
  recommedations: IUsersInterface[] | undefined;
  ModalData!: IUsersInterface;
  openModalFlag!: boolean;

  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      console.log('users here', users);
      return (this.recommedations = users.filter(userValue => userValue.username && userValue.name));
    });
  }
  
  openModal($event: IUsersInterface) {
    this.openModalFlag = true;
    this.ModalData = $event
     }
}
