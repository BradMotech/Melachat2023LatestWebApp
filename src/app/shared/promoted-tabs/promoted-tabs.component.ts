import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IPosts } from '../Interfaces/IPosts';
import { Router } from '@angular/router';

export interface headerAds{
  name:string;
  svg:string
}
@Component({
  selector: 'app-promoted-tabs',
  templateUrl: './promoted-tabs.component.html',
  styleUrls: ['./promoted-tabs.component.scss'],
})

export class PromotedTabsComponent implements AfterViewInit{
  @Input() ads:IPosts[] = []
  selectedTabTitle: string = '';
  @Input() tabsHeader:headerAds[] = [];
  @ViewChild('promoList') promoList!: ElementRef;
  currentIndex = 0;
  constructor(private router:Router){
    
  }

  ngAfterViewInit() {
    // Call the autoScroll function every 2 seconds
    setInterval(() => this.autoScroll(), 4000);
  }

  selectedTab(tabTitle: string) {
    this.selectedTabTitle = tabTitle;
  }

  viewPromoDetails(post:IPosts){
    this.router.navigate(['view-ads-details'],{queryParams:{
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
  }

  autoScroll() {
    // Get the native element of the promoList
    const promoListElement: HTMLElement = this.promoList.nativeElement;

    // Calculate the next index
    this.currentIndex = (this.currentIndex + 1) % this.ads.length;

    // Calculate the scrollLeft value based on the item width and index
    const scrollLeftValue = promoListElement.clientWidth * this.currentIndex;

    // Use smooth scroll for a nicer effect
    promoListElement.scrollTo({
      left: scrollLeftValue,
      behavior: 'smooth'
    });
  }

}
