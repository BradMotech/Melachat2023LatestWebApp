import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gallery-viewer',
  templateUrl: './gallery-viewer.component.html',
  styleUrls: ['./gallery-viewer.component.scss']
})
export class GalleryViewerComponent {
  @Input() images: string[]  = [];
  currentIndex = 0;

  constructor() { }

  ngOnInit(): void {
  }

  showNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  showPrevious(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
