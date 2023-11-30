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
    FriendRequestsComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes), SharedModule, FormsModule,ReactiveFormsModule
  ],
  providers:[DatePipe]
})
export class CoreModule { }
