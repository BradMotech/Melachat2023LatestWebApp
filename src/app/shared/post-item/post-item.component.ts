import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPosts } from '../Interfaces/IPosts';
import { FireStoreCollectionsServiceService } from '../Services/fire-store-collections-service.service';
import { Router } from '@angular/router';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectDocId } from '../State/user.selectors';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {
  @Input() Post!: IPosts;
  @Output() ViewPost = new EventEmitter<IPosts>();
  @Output() likePostEmitter = new EventEmitter<IPosts>();
  commentLength:any

  currentUserId!: string | null;
  likedByCount$!: Observable<any>;

  constructor(private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router,
    private store: Store<UserState>){

  }
  ngOnInit(): void {
    this.commentLength = Object.entries(this.Post.comments).map(([id, comment]) => ({
      id,
      username: comment,
      // Add other properties as needed...
    })).length;

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:' +this.currentUserId);
    });
  }

  
  ViewDetails(PostDetails: IPosts) {
    this.ViewPost.emit(PostDetails);
  }

  likePost(post:IPosts){
  this.likePostEmitter.emit(post);
  }

  likedByCount(postId:string,userId:string|null){
    var length = 0;
    this.fireStoreCollectionsService.getLikedByCount(postId,userId as string).subscribe((val)=>{
      length = val
    })
    return length
  }
}
