import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.scss']
})
export class GalleryItemComponent {
@Input() images:string[] | undefined = [];

constructor(private router:Router){}
showImages(images: string[] | undefined) {

  this.router.navigate(['/', 'image-viewer'], {
    queryParams: {
      images: JSON.stringify(images),
    },
  });
 
}
}
