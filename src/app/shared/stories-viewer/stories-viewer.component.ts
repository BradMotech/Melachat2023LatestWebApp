import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stories-viewer',
  templateUrl: './stories-viewer.component.html',
  styleUrls: ['./stories-viewer.component.scss']
})

export class StoriesViewerComponent implements OnInit {
  @Input() images: string[] = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR46-9ssHjlgmzM_kuLPnq7EZQmU4gIJt50L89me5V0yA&s","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ-rYR5uzXPRbm1GhVu8Zar0TplPL-ArnZEVbO4wKdWw&s"];
  currentImageIndex = 0;

  ngOnInit() {
    this.startSlideShow();
  }

  startSlideShow() {
    setInterval(() => {
      this.showNextImage();
    }, 7000); // Change this value to adjust the time interval (in milliseconds)
  }

  showNextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }
}