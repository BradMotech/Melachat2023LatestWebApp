import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUsersInterface } from '../Interfaces/IUsersInterface';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectDocId } from '../State/user.selectors';
import { FireStoreCollectionsServiceService } from '../Services/fire-store-collections-service.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  @Input() image: string = '';
  @Input() currentUserObject!: IUsersInterface;
  @Input() currentUserId:string | null = ''
  isNavbarCollapsed: boolean = false;
  currentUser!: IUsersInterface | null;
  currentUserDetails!: IUsersInterface | null;
  currentUserProfileDetails$: any;
  constructor(private router: Router, private store: Store<UserState>,private fireStoreCollectionsService:FireStoreCollectionsServiceService) {}
  ngOnInit(): void {
    // this.store.select(selectCurrentUser).subscribe((user) => {
    //   this.currentUser = user;
    //   console.log('Current user:', this.currentUser);
    // });
    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });

    this.currentUserProfileDetails$ = this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      // console.log('users here', users);
      this.currentUserDetails = users.filter(x=> x.docId == this.currentUserId)[0]
      return (users.filter(x=> x.docId == this.currentUserId));
    });
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  navigate(url: string) {
    this.router.navigate([`${url}`], {
      queryParams: {
        InterestedIn: this.currentUserDetails!.InterestedIn,
        availability: this.currentUserDetails!.availability,
        bio: this.currentUserDetails!.bio,
        blocked: this.currentUserDetails!.blocked,
        created: this.currentUserDetails!.created,
        dob: this.currentUserDetails!.dob,
        friends: this.currentUserDetails!.friends,
        image: this.currentUserDetails!.image,
        language: this.currentUserDetails!.language,
        location: this.currentUserDetails!.location,
        name: this.currentUserDetails!.name,
        notificationToken: this.currentUserDetails!.notificationToken,
        password: this.currentUserDetails!.password,
        phone: this.currentUserDetails!.phone,
        requests: this.currentUserDetails!.requests,
        suspended: this.currentUserDetails!.suspended,
        username: this.currentUserDetails!.username,
      },
    });
  }

  truncateText(text: any, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}
