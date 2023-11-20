import { Component, Input } from '@angular/core';
import { IPosts } from '../Interfaces/IPosts';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent {
@Input() Post!:IPosts
}
