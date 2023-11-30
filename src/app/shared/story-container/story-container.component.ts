import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../State/user.selectors';
import { IUsersInterface } from '../Interfaces/IUsersInterface';

@Component({
  selector: 'app-story-container',
  templateUrl: './story-container.component.html',
  styleUrls: ['./story-container.component.scss'],
})
export class StoryContainerComponent implements OnInit {
  @Input() addStory: boolean = true;
  @Input() userImage: string = '';
  @Input() stories: any[] = [];
  @Output() addStoryEmiiter = new EventEmitter<unknown>();
  currentUser!: IUsersInterface | null;
  constructor(private store: Store<UserState>) {}

  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    });
  }

  addStoryFunction() {
    this.addStoryEmiiter.emit();
  }
}
