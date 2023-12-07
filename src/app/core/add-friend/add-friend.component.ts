import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { AlertService } from 'src/app/shared/Services/alert.service';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import { selectDocId } from 'src/app/shared/State/user.selectors';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss'],
})
export class AddFriendComponent {
  recommedations: IUsersInterface[] = [];
  originalRecommendations: IUsersInterface[] = [];
  ModalData!: IUsersInterface;
  openModalFlag!: boolean;
  currentUserId!: string | null;

  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router,
    private store: Store<UserState>,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      console.log('users here', users);
      this.originalRecommendations = users.filter(
        (userValue) => userValue.username && userValue.name
      )
      return (this.recommedations = this.originalRecommendations);
    });

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });
  }

  openModal($event: IUsersInterface) {
    this.openModalFlag = true;
    this.ModalData = $event;
  }

  addNewFriend(userId: string, userNumber: string) {
    this.fireStoreCollectionsService
      .addFriend(this.currentUserId as string, userNumber)
      .subscribe((val) => {
        // alert(val);
      });
    this.fireStoreCollectionsService
      .addFriend(userId, userNumber)
      .subscribe((val) => {
        // alert(val);
      });
    this.alertService.success(
      'Friend requested successully sent to ' + userNumber
    );
  }

  searchFriends(value: string) {
    const searchTerm = value.toLowerCase();
  
    // If the search term is empty, restore the original list
    if (!searchTerm) {
      this.recommedations = this.originalRecommendations;
      return;
    }
  
    // Filter recommendations based on the search term
    const filteredRecommendations = this.originalRecommendations?.filter((recommendation) => {
      return (
        recommendation.username.toLowerCase().includes(searchTerm) ||
        recommendation.name.toLowerCase().includes(searchTerm)
      );
    });
  
    this.recommedations = filteredRecommendations;
  }

  userProfileNavigation(friend: IUsersInterface) {
    this.router.navigate(['friend-profile'], {
      queryParams: {
        friendData: JSON.stringify(friend),
      },
    });
  }
}
