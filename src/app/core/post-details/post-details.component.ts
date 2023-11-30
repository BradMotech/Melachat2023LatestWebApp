import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IPosts } from 'src/app/shared/Interfaces/IPosts';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import {
  selectCurrentUser,
  selectDocId,
} from 'src/app/shared/State/user.selectors';

export interface IComment {
  username: string;
  userImage: string;
  postedAt: string;
  comment: string;
}

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
})
export class PostDetailsComponent implements OnInit {
  Post!: IPosts;
  PostContentFormControl: FormControl = new FormControl();
  postText: string = '';
  currentUserId!: string | null;
  currentUser!: IUsersInterface | null;
  postComments!: { id: string; username: any }[];

  constructor(
    private router: Router,
    private store: Store<UserState>,
    private firebaseService: FireStoreCollectionsServiceService
  ) {}

  ngOnInit(): void {
    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });

    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    });

    this.router.routerState.root.queryParams.subscribe((params: any) => {
      // console.warn(params.comments);
      if (params) {
        this.Post = {
          title: params.title,
          comments: params.comments,
          datePosted: params.datePosted,
          likedBy: params.likedBy,
          likes: params.likes,
          originalPost: params.originalPost,
          post: params.post,
          postImage: params.postImage,
          postVideo: params.postVideo,
          user: params.user,
          userImage: params.userImage,
          username: params.username,
          viewedBy: params.viewedBy,
          docId: params.docId,
        };
        this.firebaseService.getAllPoststags().subscribe((post) => {
          var eachPost = post.find(
            (eachPost: IPosts) => eachPost.title == params.title
          );
          const commentsArray = Object.entries(eachPost?.comments).map(
            ([id, comment]) => ({
              id,
              username: comment,
              // Add other properties as needed...
            })
          );

          this.postComments = commentsArray;
          console.warn('found post', commentsArray);
        });
      }
    });

    // var postComments = this.getComments(this.Post);
    // console.warn("post comments list" ,postComments)

    this.PostContentFormControl.valueChanges.subscribe((value) => {
      console.log('PostContent value changed:', value);
      this.postText = value;
    });
  }

  postComment(post: IPosts) {}

  getCommentKeys(): string[] {
    return Object.keys(this.Post.comments || {});
  }

  AddComment() {
    this.firebaseService
      .addCommentToPost(
        this.Post.docId,
        this.currentUserId as string,
        this.postText,
        this.currentUserId as string,
        this.currentUser?.username as string,
        this.currentUser?.image as string
      )
      .subscribe((x) => {
        // alert(x)
        this.postText = '';
        this.PostContentFormControl.setValue('');
        console.log(x);
        var post = <IComment>{
          username: this.currentUser?.username as string,
          userImage: this.currentUser?.image as string,
          userId:this.currentUser?.docId,
          postedAt: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
          comment: this.postText,
        };

        this.postComments.push({id:'',username:post});
      });
  }
}
