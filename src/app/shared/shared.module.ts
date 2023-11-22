import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './app-header/app-header.component';
import { StoryContainerComponent } from './story-container/story-container.component';
import { PostItemComponent } from './post-item/post-item.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { ModalComponent } from './modal/modal.component';
import { TabsComponent } from './tabs/tabs.component';
import { SearchComponent } from './search/search.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { PostListComponent } from './post-list/post-list.component';
import { CommentBoxComponent } from './comment-box/comment-box.component';
import { NewsCardComponent } from './news-card/news-card.component';
import { NewFriendCardComponent } from './new-friend-card/new-friend-card.component';
import { FloatingButtonComponent } from './floating-button/floating-button.component';
import { DialogComponent } from './dialog/dialog.component';
import { ImagesGridComponent } from './images-grid/images-grid.component';
import { StoryCubeComponent } from './story-cube/story-cube.component';

@NgModule({
  declarations: [
    AppHeaderComponent,
    StoryContainerComponent,
    PostItemComponent,
    RecommendationsComponent,
    ModalComponent,
    TabsComponent,
    SearchComponent,
    ChatListComponent,
    PostListComponent,
    CommentBoxComponent,
    NewsCardComponent,
    NewFriendCardComponent,
    FloatingButtonComponent,
    DialogComponent,
    ImagesGridComponent,
    StoryCubeComponent,
  ],
  imports: [CommonModule],
  exports: [
    AppHeaderComponent,
    StoryContainerComponent,
    PostItemComponent,
    RecommendationsComponent,
    ModalComponent,
    TabsComponent,
    SearchComponent,
    ChatListComponent,
    PostListComponent,
    NewsCardComponent,
    NewFriendCardComponent,
    FloatingButtonComponent,
    DialogComponent,
    ImagesGridComponent,
    StoryCubeComponent
  ],
})
export class SharedModule {}
