import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { TrendingComponent } from './trending/trending.component';
import { AddPostComponent } from './add-post/add-post.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddStoryComponent } from './add-story/add-story.component';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { NotificationComponent } from './notification/notification.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { AllPostsFullScreenComponent } from './all-posts-full-screen/all-posts-full-screen.component';
import { StoriesViewerWrapperComponent } from './stories-viewer-wrapper/stories-viewer-wrapper.component';
import { FriendProfileComponent } from './friend-profile/friend-profile.component';
import { GalleryViewerComponent } from './gallery-viewer/gallery-viewer.component';
import { PromoteItemMainComponent } from './promote-item-main/promote-item-main.component';
import { ViewAdsDetailsComponent } from './view-ads-details/view-ads-details.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { environment } from 'src/environments/environment.prod';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'browse-friends', component: AddFriendComponent },
  { path: 'add-post', component: AddPostComponent },
  { path: 'post-details', component: PostDetailsComponent },
  { path: 'add-story', component: AddStoryComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'messaging', component: ChatScreenComponent },
  { path: 'notifications', component: NotificationComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'friend-requests', component: FriendRequestsComponent },
  { path: 'all-posts', component: AllPostsFullScreenComponent },
  { path: 'view-stories', component: StoriesViewerWrapperComponent },
  { path: 'friend-profile', component: FriendProfileComponent },
  { path: 'image-viewer', component: GalleryViewerComponent },
  { path: 'promote-item', component: PromoteItemMainComponent },
  { path: 'view-ads-details', component: ViewAdsDetailsComponent },
];



@NgModule({
  declarations: [
    DashboardComponent,
    AddFriendComponent,
    TrendingComponent,
    AddPostComponent,
    PostDetailsComponent,
    AddStoryComponent,
    ChatScreenComponent,
    NotificationComponent,
    UserProfileComponent,
    FriendRequestsComponent,
    AllPostsFullScreenComponent,
    FriendProfileComponent,
    GalleryViewerComponent,
    StoriesViewerWrapperComponent,
    PromoteItemMainComponent,
    ViewAdsDetailsComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes), SharedModule, FormsModule,ReactiveFormsModule, AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule
  ],
  providers:[DatePipe]
})
export class CoreModule { }
