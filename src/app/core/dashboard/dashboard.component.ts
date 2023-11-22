import { Component, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IHashTags } from 'src/app/shared/Interfaces/IHashTags';
import { IPosts } from 'src/app/shared/Interfaces/IPosts';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  recommedations: IUsersInterface[] | undefined;
  hashtags: IHashTags[] | undefined;
  readonly CHATS = "Chats";
  readonly POSTS = "Posts";
  readonly NEWS = "News";
  selectedTabTitle:string = this.CHATS;
  ModalData!: IUsersInterface;
  openModalFlag!: boolean;
  AllPosts!: IPosts[];
  NewsArticles!:any[]
  
  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      console.log('users here', users);
      return (this.recommedations = users);
    });
    this.fireStoreCollectionsService.getAllHashtags().subscribe(hashtags => this.hashtags = hashtags);

    this.fireStoreCollectionsService.getAllPoststags().subscribe(posts => {
      console.warn(posts)
      return this.AllPosts = posts});

    fetch(
      "https://newsapi.org/v2/top-headlines?country=za&apiKey=32054b2282e440a2bf45da9fcacb2040"
    )
      .then((response) => response.json())
      .then((json) => {
        this.NewsArticles = json.articles;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onTabSelected(selectedTabTitle: string) {
    // Handle the selected tab's title in the parent component
    console.log('Selected Tab:', selectedTabTitle);
    this.selectedTabTitle = selectedTabTitle
    // You can perform any further actions with the selected title here.
  }

  openModal($event: IUsersInterface) {
   this.openModalFlag = true;
   this.ModalData = $event
    }

    closeModal($event: boolean) {
      if($event == true){
        this.openModalFlag = false;
      }
      }

      browseFriends(){
      this.router.navigate(['/', 'browse-friends'])
      }

      AddPost(){
        this.router.navigate(['/', 'add-post'])
      }
}
