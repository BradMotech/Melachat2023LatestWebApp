import { Component, Input } from '@angular/core';
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

export class PromotedTabsComponent {
  @Input() ads:IPosts[] = []
  selectedTabTitle: string = '';
  @Input() tabsHeader:headerAds[] = [];

  constructor(private router:Router){
    
  }

  selectedTab(tabTitle: string) {
    this.selectedTabTitle = tabTitle;
  }

  viewPromoDetails(post:IPosts){
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
  }
}
