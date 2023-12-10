import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-images-grid',
  templateUrl: './images-grid.component.html',
  styleUrls: ['./images-grid.component.scss']
})
export class ImagesGridComponent {
@Input() images!:any[];
@Input() addPost:boolean = false;
@Output() previewImagesEmitter = new EventEmitter<string[]>()
@Output() previewImagesArrayEmitter = new EventEmitter<string[]>()


previewImages(item:string[]){
this.previewImagesEmitter.emit(item)
}
// previewImagesArray(images:string[]){
// this.previewImagesArrayEmitter.emit(images)
// }
}
