import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStories } from 'src/app/shared/Services/fire-store-collections-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stories-viewer-wrapper',
  templateUrl: './stories-viewer-wrapper.component.html',
  styleUrls: ['./stories-viewer-wrapper.component.scss']
})
export class StoriesViewerWrapperComponent {
  @Input() images: string[] = [];
  currentStoryIndex = 0;
  userStory!: UserStories ;
  userStories: any
  constructor( private route: ActivatedRoute, private router: Router,){

  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const storiesDataString = params['storiesData'];
      if (storiesDataString) {
        // this.friendData = JSON.parse(friendDataString);
        this.userStory = JSON.parse(storiesDataString);
        this.userStories = this.userStory.stories;
        console.warn(this.userStories)
      }
    });
    this.startSlideShow();
  }

  startSlideShow() {
    setInterval(() => {
      this.showNextImage();
    }, 7000); // Change this value to adjust the time interval (in milliseconds)
  }

  showNextImage() {
    this.currentStoryIndex = (this.currentStoryIndex + 1) % this.userStories.length;
  }


  navigateBack() {
    this.router.navigate(['/', 'home']);
  }
}
