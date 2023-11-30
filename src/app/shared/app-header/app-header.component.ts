import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUsersInterface } from '../Interfaces/IUsersInterface';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../State/user.selectors';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  @Input() image: string = '';
  @Input() currentUserObject!: IUsersInterface;
  isNavbarCollapsed: boolean = false;
  currentUser!: IUsersInterface | null;
  constructor(private router: Router, private store: Store<UserState>) {}
  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    });
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  navigate(url: string) {
    this.router.navigate([`${url}`], {
      queryParams: {
        InterestedIn: this.currentUser!.InterestedIn,
        availability: this.currentUser!.availability,
        bio: this.currentUser!.bio,
        blocked: this.currentUser!.blocked,
        created: this.currentUser!.created,
        dob: this.currentUser!.dob,
        friends: this.currentUser!.friends,
        image: this.currentUser!.image,
        language: this.currentUser!.language,
        location: this.currentUser!.location,
        name: this.currentUser!.name,
        notificationToken: this.currentUser!.notificationToken,
        password: this.currentUser!.password,
        phone: this.currentUser!.phone,
        requests: this.currentUser!.requests,
        suspended: this.currentUser!.suspended,
        username: this.currentUser!.username,
      },
    });
  }
}
