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
  @Input() PromotePost: boolean = false;
  @Output() ViewPost = new EventEmitter<IPosts>();
  @Output() HashTagNavigationEmmitter = new EventEmitter<string>();
  @Output() likePostEmitter = new EventEmitter<IPosts>();
  @Output() deletePostEmitter = new EventEmitter<IPosts>();
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
  deletePost(post:IPosts){
  this.deletePostEmitter.emit(post);
  }

  likedByCount(postId:string,userId:string|null){
    var length = 0;
    this.fireStoreCollectionsService.getLikedByCount(postId,userId as string).subscribe((val)=>{
      length = val
    })
    return length
  }

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
  
  isHashtag(word: string): boolean {
    return word.startsWith('#') && !word.includes('#', 1); // Check if the word starts with '#' and doesn't contain another '#' after the first character
  }

  isURL(word: string): boolean {
    return word.startsWith('http://') || word.startsWith('https://');
  }

  navigateToTrending(hashtag:string){
    // this.router.navigate(['trending'])
    this.HashTagNavigationEmmitter.emit(hashtag)
  }

  openUrl(url:string){
window.open(url)
  }
}
