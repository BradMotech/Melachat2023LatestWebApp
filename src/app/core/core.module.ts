import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { TrendingComponent } from './trending/trending.component';
import { AddPostComponent } from './add-post/add-post.component';
import { PostDetailsComponent } from './post-details/post-details.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'browse-friends', component: AddFriendComponent },
  { path: 'add-post', component: AddPostComponent },
  { path: 'post-details', component: PostDetailsComponent },
];


@NgModule({
  declarations: [
    DashboardComponent,
    AddFriendComponent,
    TrendingComponent,
    AddPostComponent,
    PostDetailsComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes), SharedModule
  ]
})
export class CoreModule { }
