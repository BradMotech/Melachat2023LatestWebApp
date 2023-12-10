import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStories } from 'src/app/shared/Services/fire-store-collections-service.service';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-stories-viewer-wrapper',
  templateUrl: './stories-viewer-wrapper.component.html',
  styleUrls: ['./stories-viewer-wrapper.component.scss']
})
export class StoriesViewerWrapperComponent {
  @Input() images: string[] = [];
  currentStoryIndex = 0;
  userStory!: UserStories ;
  userStories: any;
  MessageTextFormControl: FormControl = new FormControl();
  messageText: string = '';
  isSlideshowPaused = false;
  constructor( private route: ActivatedRoute, private router: Router,){

  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const storiesDataString = params['storiesData'];
      console.log(storiesDataString)
      if (storiesDataString) {
        // this.friendData = JSON.parse(friendDataString);
        this.userStory = JSON.parse(storiesDataString);
        this.userStories = this.userStory.stories;
        console.log(this.userStories)
      }
    });
    this.startSlideShow();
    this.MessageTextFormControl.valueChanges.subscribe((val:string)=>{
      this.messageText = val;
      this.toggleSlideshowPause();
    })
  }

  startSlideShow() {
    setInterval(() => {
      if (!this.isSlideshowPaused) {
        this.showNextImage();
      }
    }, 4000); // Change this value to adjust the time interval (in milliseconds)
  }

  showNextImage() {
    this.currentStoryIndex = (this.currentStoryIndex + 1) % this.userStories.length;
  }

  showPrevious(): void {
    this.currentStoryIndex =
      (this.currentStoryIndex - 1 + this.userStories.length) % this.userStories.length;
  }

  navigateBack() {
    this.router.navigate(['/', 'home']);
  }

  toggleSlideshowPause() {
    this.isSlideshowPaused = this.messageText.trim().length > 0;
  }

  sendTextReplyMessageToUser(story:string){
    this.MessageTextFormControl.setValue("")
  }

  sendImaggeMessageTouser(story:string){

  }
}
