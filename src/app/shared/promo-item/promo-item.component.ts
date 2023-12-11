import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPosts } from '../Interfaces/IPosts';
import { FireStoreCollectionsServiceService } from '../Services/fire-store-collections-service.service';
import { Router } from '@angular/router';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectDocId } from '../State/user.selectors';

@Component({
  selector: 'app-promo-item',
  templateUrl: './promo-item.component.html',
  styleUrls: ['./promo-item.component.scss'],
})
export class PromoItemComponent {
  @Input() Post!: IPosts;
  @Input() PromotePost: boolean = false;
  @Output() ViewPost = new EventEmitter<IPosts>();
  @Output() HashTagNavigationEmmitter = new EventEmitter<string>();
  @Output() likePostEmitter = new EventEmitter<IPosts>();
  @Output() deletePostEmitter = new EventEmitter<IPosts>();
  commentLength: any;

  currentUserId!: string | null;
  likedByCount$!: Observable<any>;

  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router,
    private store: Store<UserState>
  ) {}
  ngOnInit(): void {
    this.commentLength = Object.entries(this.Post.comments).map(
      ([id, comment]) => ({
        id,
        username: comment,
        // Add other properties as needed...
      })
    ).length;

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:' + this.currentUserId);
    });
  }

  ViewDetails(PostDetails: IPosts) {
    this.ViewPost.emit(PostDetails);
  }

  likePost(post: IPosts) {
    this.likePostEmitter.emit(post);
  }
  deletePost(post: IPosts) {
    this.deletePostEmitter.emit(post);
  }

  likedByCount(postId: string, userId: string | null) {
    var length = 0;
    this.fireStoreCollectionsService
      .getLikedByCount(postId, userId as string)
      .subscribe((val) => {
        length = val;
      });
    return length;
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

  navigateToTrending(hashtag: string) {
    // this.router.navigate(['trending'])
    this.HashTagNavigationEmmitter.emit(hashtag);
  }

  openUrl(url: string) {
    window.open(url);
  }

  getRandsFromParagraphs(text: string, charLimit: number): string[] {
    // Check if the entire text matches the South African currency format
    if (this.isSouthAfricanCurrency(text)) {
      return [text];
    }
  
    const paragraphs: string[] = [];
    let currentParagraph = '';
  
    text.split(' ').forEach((word) => {
      if ((currentParagraph + ' ' + word).length <= charLimit) {
        // Check if the word is a South African currency format
        if (this.isSouthAfricanCurrency(word)) {
          // Add the currency word as the only paragraph
          paragraphs.push(word);
          currentParagraph = '';
        } else {
          // Add the word to the current paragraph
          currentParagraph += (currentParagraph.length > 0 ? ' ' : '') + word;
        }
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
  
  isSouthAfricanCurrency(word: string): boolean {
    // Check if the word matches the South African currency format (e.g., R200.00 or R 200.00)
    return /^R(\s?\d{1,3}(,\d{3})*(\.\d{2})?)$/.test(word);
  }
}
