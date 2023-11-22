import { Component, Input } from '@angular/core';
import { IPosts } from '../Interfaces/IPosts';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent {
  @Input() AllPosts!: IPosts[];

  constructor(private router: Router){

  }
  ViewPosts(post: IPosts) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: post
      }
    };
    this.router.navigate(['post-details'],{queryParams:{
      title:post.title,
      comments:post.comments,
      datePosted:post.datePosted,
      likedBy:post.likedBy,
      likes:post.likes,
      originalPost:post.originalPost,
      post:post.post,
      postImage:post.postImage,
      postVideo:post.postVideo,
      user:post.user,
      userImage:post.userImage,
      username:post.username,
      viewedBy:post.viewedBy,
    }})
  }
}
