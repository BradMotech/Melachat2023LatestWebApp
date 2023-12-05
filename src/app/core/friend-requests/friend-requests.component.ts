import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import {
  selectCurrentUser,
  selectDocId,
} from 'src/app/shared/State/user.selectors';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss'],
})
export class FriendRequestsComponent {
  currentUserId!: string | null;
  allUsers: IUsersInterface[] = [];
  currentUser!: IUsersInterface | null;
  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router,
    private store: Store<UserState>
  ) {}

  trendCount: number = 0;
  ngOnInit(): void {
    // this.store.select(selectCurrentUser).subscribe((user) => {
    //   this.currentUser = user;
    //   console.warn(this.currentUser?.requests)
    // });

    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      // console.log('users here', users);
      this.currentUser = users.filter(x=> x.docId == this.currentUserId)[0];
      return (users.filter(x=> x.docId == this.currentUserId));
    });

    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      if (this.currentUser && this.currentUser.requests) {
        this.allUsers = users.filter((userValue) =>{

console.warn("yeah",this.currentUser)
          return this.currentUser?.requests.includes(userValue.docId) && userValue.docId !== this.currentUser.docId
        }
        );
        console.warn("filtered users",this.allUsers,this.currentUser?.requests)
      } else {
        // Handle the case where currentUser or currentUser.requests is undefined
        // For example, set this.allUsers to the original array if no filtering is needed
        this.allUsers = users;
      }
    });
    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });
  }

  ApproveUser(user: IUsersInterface) {
    console.warn("check user uid",user)
    this.fireStoreCollectionsService.ApproveFriend(user,this.currentUser?.phone as string,this.currentUserId as string).subscribe((val)=>{
      // alert("Approved");
      this.fireStoreCollectionsService.addUserToCurrentUser(this.currentUser?.phone as string,user.docId).subscribe((val)=>{
        alert("added in current user collection")
      })
      this. DeclineUser(user)
    })
  }
  DeclineUser(user: IUsersInterface) {
    this.fireStoreCollectionsService.DeclineFriend(user.docId,this.currentUser?.phone as string).subscribe((val)=>{
      console.warn("id to remove",user.docId,this.currentUser?.phone)
      // alert("removed")
    })
  }
}
