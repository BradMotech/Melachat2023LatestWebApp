// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-view-ads-details',
//   templateUrl: './view-ads-details.component.html',
//   styleUrls: ['./view-ads-details.component.scss']
// })
// export class ViewAdsDetailsComponent {

// }

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
  selector: 'app-view-ads-details',
  templateUrl: './view-ads-details.component.html',
  styleUrls: ['./view-ads-details.component.scss']
})
export class ViewAdsDetailsComponent implements OnInit {
  Post!: IPosts;
  PostContentFormControl: FormControl = new FormControl();
  postText: string = '';
  currentUserId!: string | null;
  currentUser!: IUsersInterface | null;
  postComments!: { id: string; username: any }[];
  likesArray!: { id: string; username: string }[];
  viewsArray!: { id: string; username: string }[];
  filledHeart: boolean = false;

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
      console.warn(
        'here we gooooooo' + params.docId,
        this.currentUserId as string
      );

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
        this.firebaseService.getAllPromostags().subscribe((post) => {
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
          const likesArray = Object.entries(eachPost?.likedBy as string[]).map(
            ([id, likes]) => ({
              id,
              username: likes,
              // Add other properties as needed...
            })
          );
          const viewsArray = Object.entries(eachPost?.viewedBy as string[]).map(
            ([id, views]) => ({
              id,
              username: views,
              // Add other properties as needed...
            })
          );

          this.postComments = commentsArray
          this.likesArray = likesArray;
          this.viewsArray = viewsArray;
          console.log('found post comments', this.postComments);
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

  // postComment(post: IPosts) {}

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
          userId: this.currentUser?.docId,
          postedAt: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
          comment: this.postText,
        };

        // this.postComments.push({id:'',username:post});
      });
  }

  // getParagraphs(text: string, charLimit: number): string[] {
  //   const paragraphs: string[] = [];
  //   let currentParagraph = '';

  //   text.split(' ').forEach((word) => {
  //     if ((currentParagraph + ' ' + word).length <= charLimit) {
  //       // Add the word to the current paragraph
  //       currentParagraph += (currentParagraph.length > 0 ? ' ' : '') + word;
  //     } else {
  //       // Start a new paragraph
  //       paragraphs.push(currentParagraph);
  //       currentParagraph = word;
  //     }
  //   });

  //   // Add the last paragraph
  //   if (currentParagraph.length > 0) {
  //     paragraphs.push(currentParagraph);
  //   }

  //   return paragraphs;
  // }
  getParagraphs(text: string, charLimit: number): string[] {
    const paragraphs: string[] = [];
    let currentParagraph = '';

    text.split(' ').forEach((word) => {
      if ((currentParagraph + ' ' + word).length <= charLimit) {
        // Add the word to the current paragraph
        currentParagraph += (currentParagraph.length > 0 ? ' ' : '') + word;
      } else {
        // Start a new paragraph
        paragraphs.push(currentParagraph);
        currentParagraph = word;
      }
    });

    // Add the last paragraph
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph);
    }

    return paragraphs;
  }

  navigateToTrending(hashtag: string) {
    this.router.navigate(['trending']);
  }

  likePost(post: IPosts) {
    this.filledHeart = true;
    this.firebaseService
      .addUserIdToLikedBy(post.docId, this.currentUserId as string)
      .subscribe((val) => {
        // console.warn( post.docId + this.currentUserId)
        setTimeout(() => {
          this.filledHeart = false;
        }, 500);
      });
  }

  favourite(comment: { id: string; username: any }) {
    this.filledHeart = true;

    // alert("favourited")removeCommentFromPost
    this.firebaseService
      .favoriteComment(
        this.Post.docId,
        comment.id,
        this.currentUserId as string,
        comment
      )
      .subscribe((x) => {
        setTimeout(() => {
          this.filledHeart = false;
        }, 1000);
      });
  }
  commentOn(comment: { id: string; username: any }) {
    // alert('favourited');
  }
  report(comment: { id: string; username: any }) {
    // alert('favourited');
  }

  isURL(word: string): boolean {
    return word.startsWith('http://') || word.startsWith('https://');
  }

  isHashtag(word: string): boolean {
    return word.startsWith('#') && !word.includes('#', 1); // Check if the word starts with '#' and doesn't contain another '#' after the first character
  }
  openUrl(url: string) {
    window.open(url);
  }

  showImages(images: string[]) {

    this.router.navigate(['/', 'image-viewer'], {
      queryParams: {
        images: JSON.stringify(images),
      },
    });
   
  }
}
