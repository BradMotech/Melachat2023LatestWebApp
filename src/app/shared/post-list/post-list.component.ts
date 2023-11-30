import { Component, Input, OnInit } from '@angular/core';
import { IPosts } from '../Interfaces/IPosts';
import { NavigationExtras, Router } from '@angular/router';
import { FireStoreCollectionsServiceService } from '../Services/fire-store-collections-service.service';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { selectDocId } from '../State/user.selectors';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit{
  @Input() AllPosts!: IPosts[];
  currentUserId!: string | null;

  constructor(private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router,
    private store: Store<UserState>){

  }
  ngOnInit(): void {
    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:' +this.currentUserId);
    });
  }


  ViewPosts(post: IPosts) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: post
      }
    };

    console.log(post)
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
      docId:post.docId,
    }})

    this.fireStoreCollectionsService.addUserIdToViewedBy(post.docId,this.currentUserId as string)
  }

  likePost(post: IPosts){
  this.fireStoreCollectionsService.addUserIdToLikedBy(post.docId,this.currentUserId as string).subscribe((val)=>{
    // console.warn( post.docId + this.currentUserId)
  })
  }
}
