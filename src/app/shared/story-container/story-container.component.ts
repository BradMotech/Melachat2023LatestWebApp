import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectDocId } from '../State/user.selectors';
import { IUsersInterface } from '../Interfaces/IUsersInterface';
import { UserStories } from '../Services/fire-store-collections-service.service';

@Component({
  selector: 'app-story-container',
  templateUrl: './story-container.component.html',
  styleUrls: ['./story-container.component.scss'],
})
export class StoryContainerComponent implements OnInit {
  @Input() addStory: boolean = true;
  @Input() userImage: string = '';
  @Input() stories: UserStories[] = [];
  @Output() addStoryEmiiter = new EventEmitter<unknown>();
  currentUser!: IUsersInterface | null;
  currentUserId: string = "";
  currentUserStories: UserStories[] = [];
  constructor(private store: Store<UserState>) {}

  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    });
    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id as string;
      console.log('Current user id:', this.currentUserId);
    });
    // this.getCurrentUserStories();
  }
  // getCurrentUserStories() {
  //   const currentUserId = 'your_current_user_id'; // replace with the actual current user id
  //   this.currentUserStories = this.stories.filter(story => story.user === this.currentUserId);
  //   console.log("CurrentUserStories:", this.currentUserStories);
  // }

  addStoryFunction() {
    this.addStoryEmiiter.emit();
  }
}
