import { Component, Input } from '@angular/core';
import { IPosts } from '../Interfaces/IPosts';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
@Input() AllPosts!:IPosts[]
}
