import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-story-cube',
  templateUrl: './story-cube.component.html',
  styleUrls: ['./story-cube.component.css']
})
export class StoryCubeComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  isShowingFront = true;

  toggleScreen() {
    this.isShowingFront = !this.isShowingFront;
  }
}
