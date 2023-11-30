import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { FireStoreCollectionsServiceService, UserStories } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import {
  selectCurrentUser,
  selectDocId,
} from 'src/app/shared/State/user.selectors';

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.scss'],
})
export class AddStoryComponent implements OnInit {
  backgroundColorIndex = 0;
  showCursor: boolean = true;
  backgroundImage = '../../../assets//melachatbackground.png';
  backgroundColors = [
    '#8B4513',
    '#FFD700',
    '#008080',
    '#9932CC',
    '#00FF00',
    '#FF00FF',
    '#808080',
    '#FF4500',
    '#4B0082',
    '#00FFFF',
    '#F08080',
    '#7CFC00',
    '#A52A2A',
    '#B22222',
    '#8A2BE2',
    '#32CD32',
    '#20B2AA',
    '#FF69B4',
    '#800000',
    '#66CDAA',
    '#DC143C',
    '#00FA9A',
    '#000080',
    '#FF6347',
    '#9400D3',
    '#FFA07A',
    '#556B2F',
    '#2F4F4F',
    '#6B8E23',
    '#FF7F50',
    '#483D8B',
    '#00BFFF',
    '#87CEEB',
    '#00CED1',
    '#4682B4',
    '#9ACD32',
    '#DAA520',
    '#008000',
    '#A52A2A',
    '#8B008B',
    '#808000',
    '#F4A460',
    '#4B0082',
    '#CD5C5C',
    '#8B0000',
    '#2F4F4F',
    '#483D8B',
    '#000080',
    '#008080',
    '#556B2F',
  ];
  backgroundColor = this.backgroundColors[0]; // Default background color
  currentUser!: IUsersInterface | null;
  currentUserId!: string | null;
  showImageBackground: boolean = false;
  TextStoryFormControl: FormControl = new FormControl();
  storyTextValue: string = '';

  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private store: Store<UserState>,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    });

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });

    this.TextStoryFormControl.valueChanges.subscribe((val)=>{
      this.storyTextValue = val
    })
  }
  switchBackgroundColorPalette(): void {
    // Increment the background color index
    this.backgroundColorIndex =
      (this.backgroundColorIndex + 1) % this.backgroundColors.length;

    // Update the backgroundColor property
    this.backgroundColor = this.backgroundColors[this.backgroundColorIndex];
  }

  onInput(event: any): void {
    const editableDiv = document.getElementById('editable-div');
    const hintDiv = document.getElementById('hint');

    if (editableDiv && hintDiv) {
      editableDiv.style.height = 'auto';
      editableDiv.style.height = editableDiv.scrollHeight + 'px';

      // Show or hide the hint based on the content
      hintDiv.style.visibility =
        editableDiv.textContent?.trim() === '' ? 'visible' : 'hidden';
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const editableDiv = document.getElementById('editable-div');
    if (
      editableDiv &&
      event.key === 'Enter' &&
      editableDiv.textContent &&
      editableDiv.textContent.length % 100 === 0
    ) {
      document.execCommand('insertHTML', false, '<br>');
      event.preventDefault();
    }
  }

  navigateBack() {
    this.router.navigate(['/', 'home'], {
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

  // onKeyDown(event: KeyboardEvent): void {
  //   const editableDiv = document.getElementById('editable-div');
  //   if (editableDiv && event.key === 'Enter' && editableDiv.textContent.length % 100 === 0) {
  //     document.execCommand('insertHTML', false, '<br>');
  //     event.preventDefault();
  //   }
  // }
  // onInput(event: any): void {
  //   const editableDiv = document.getElementById('editable-div');
  //   if (editableDiv) {
  //     editableDiv.style.height = 'auto';
  //     editableDiv.style.height = editableDiv.scrollHeight + 'px';
  //   }
  // }

  typeOfStory(value:string){
    switch (value) {
      case 'ImageStory':
        this.showImageBackground = true;
        break;
      case 'TextStory':
        this.showImageBackground = false;
        break;
    
      default:
        break;
    }
  }

  uploadTextStory(){
    const userStory = <UserStories>{
      username: this.currentUser?.username,
  profile: this.currentUser?.image,
  user: this.currentUserId,
  count: 0,
  stories: [],
    }
    this.fireStoreCollectionsService.uploadTextStory(userStory,this.storyTextValue,this.backgroundColor).subscribe((val)=>{
      console.log(val)
    })
  }
}
