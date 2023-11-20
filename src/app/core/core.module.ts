import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { TrendingComponent } from './trending/trending.component';
import { AddPostComponent } from './add-post/add-post.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'browse-friends', component: AddFriendComponent },
  { path: 'add-post', component: AddPostComponent },
];


@NgModule({
  declarations: [
    DashboardComponent,
    AddFriendComponent,
    TrendingComponent,
    AddPostComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes), SharedModule
  ]
})
export class CoreModule { }
