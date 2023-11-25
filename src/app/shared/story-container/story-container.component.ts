import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-story-container',
  templateUrl: './story-container.component.html',
  styleUrls: ['./story-container.component.scss']
})
export class StoryContainerComponent {
@Input() addStory:boolean = true;
@Input() stories:any[]=[];
@Output() addStoryEmiiter = new EventEmitter<unknown>()

addStoryFunction(){
this.addStoryEmiiter.emit()
}
}
