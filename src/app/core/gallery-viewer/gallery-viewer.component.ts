import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery-viewer',
  templateUrl: './gallery-viewer.component.html',
  styleUrls: ['./gallery-viewer.component.scss'],
})
export class GalleryViewerComponent {
  @Input() images: string[] = [];
  currentIndex = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe((params: any) => {
      if (params) {
        this.images = JSON.parse(params.images);
        // alert(params.images)
      }
    });
  }

  showNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  showPrevious(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  navigateBack() {
    this.router.navigate(['/', 'post-details']);
  }

}
