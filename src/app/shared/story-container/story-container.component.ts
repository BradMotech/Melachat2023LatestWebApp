import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectDocId } from '../State/user.selectors';
import { IUsersInterface } from '../Interfaces/IUsersInterface';
import { FireStoreCollectionsServiceService, UserStories } from '../Services/fire-store-collections-service.service';

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
  @Output() viewStoriesEmitter = new EventEmitter<UserStories>();
  currentUser!: IUsersInterface | null;
  currentUserId: string = "";
  @Input() CurrentUserStories: UserStories[] = [];
  currentUserStories: UserStories[] = [];
  constructor(private store: Store<UserState>,private fireStoreCollectionsService:FireStoreCollectionsServiceService) {}

  ngOnInit(): void {
    // this.store.select(selectCurrentUser).subscribe((user) => {
    //   this.currentUser = user;
    //   console.log('Current user:', this.currentUser);
    // });
    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id as string;
      console.log('Current user id:', this.currentUserId);
    });

    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      // console.log('users here', users);
      this.currentUser = users.filter(x=> x.docId == this.currentUserId)[0];
      return (users.filter(x=> x.docId == this.currentUserId));
    });
    // this.getCurrentUserStories();
  }
  // getCurrentUserStories() {
  //   const currentUserId = this.currentUserId ; // replace with the actual current user id
  //   this.currentUserStories = this.stories.filter(story => story.user === this.currentUserId);
  //   console.log("CurrentUserStories:", this.currentUserStories);
  // }

  addStoryFunction() {
    this.addStoryEmiiter.emit();
  }

  ViewUserStories(item:UserStories){
    console.log(item)
this.viewStoriesEmitter.emit(item)
  }
}
