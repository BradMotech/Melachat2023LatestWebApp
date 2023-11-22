import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPosts } from 'src/app/shared/Interfaces/IPosts';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
})
export class PostDetailsComponent implements OnInit {
  Post!: IPosts;

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe((params:any) =>{
      if(params){
       this.Post = {
        title:params.title,
        comments:params.comments,
        datePosted:params.datePosted,
        likedBy:params.likedBy,
        likes:params.likes,
        originalPost:params.originalPost,
        post:params.post,
        postImage:params.postImage,
        postVideo:params.postVideo,
        user:params.user,
        userImage:params.userImage,
        username:params.username,
        viewedBy:params.viewedBy,
       }
      }
    })
  }
}
