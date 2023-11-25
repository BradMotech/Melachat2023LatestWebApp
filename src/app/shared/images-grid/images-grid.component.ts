import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-images-grid',
  templateUrl: './images-grid.component.html',
  styleUrls: ['./images-grid.component.scss']
})
export class ImagesGridComponent {
@Input() images!:any[];
@Input() addPost:boolean = false;
}
