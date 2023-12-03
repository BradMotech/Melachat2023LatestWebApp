import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { IHashTags } from 'src/app/shared/Interfaces/IHashTags';
import { IPosts } from 'src/app/shared/Interfaces/IPosts';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { FireStoreCollectionsServiceService, UserStories } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import {
  selectCurrentUser,
  selectDocId,
} from 'src/app/shared/State/user.selectors';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  recommedations: IUsersInterface[] | undefined;
  hashtags: IHashTags[] | undefined;
  readonly CHATS = 'Chats';
  readonly POSTS = 'Posts';
  readonly NEWS = 'News';
  selectedTabTitle: string = this.CHATS;
  ModalData!: IUsersInterface;
  openModalFlag!: boolean;
  AllPosts!: IPosts[];
  friends!: IUsersInterface[] | undefined;
  ListOfStories!: UserStories[];
  NewsArticles!: any[];
  showRecommendations: boolean = false;
  hide: boolean = false;
  InterestedIn: any;
  availability: any;
  bio: any;
  blocked: any;
  created: any;
  dob: any;
  image: any;
  language: any;
  location: any;
  name: any;
  notificationToken: any;
  password: any;
  phone: any;
  requests: any;
  suspended: any;
  username: any;
  currentUserObject!: IUsersInterface;
  currentUser!: IUsersInterface | null;
  currentUserId!: string | null;
  searchPlaceholder:string = "Search users..."

  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router,
    private store: Store<UserState>
  ) {}
  ngOnInit(): void {
    this.fetchAllStories()
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
      console.log('Current user friends:', this.currentUser?.requests);
      
    });

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });

    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      // console.log('users here', users);
      return (this.recommedations = users);
    });
    this.fireStoreCollectionsService
      .getAllHashtags()
      .subscribe((hashtags) => (this.hashtags = hashtags));

    // this.fireStoreCollectionsService.getAllPoststags().subscribe((posts) => {
    //   // console.warn(posts);
    //   return (this.AllPosts = posts.filter(
    //     (v) => v.post !== '' && v.username !== ''
    //   ));
    // });
    this.fireStoreCollectionsService.getAllPoststags().subscribe((posts) => {
      // Sort the posts by dateAdded in descending order (most recent first)
      this.AllPosts = posts
        .filter((v) => v.post !== '' && v.username !== '' && v.title != '')
        .sort((a, b) => {
          const dateA = new Date(a.datePosted).getTime();
          const dateB = new Date(b.datePosted).getTime();
          return dateB - dateA;
        });
    });

    fetch(
      'https://newsapi.org/v2/top-headlines?country=za&apiKey=32054b2282e440a2bf45da9fcacb2040'
    )
      .then((response) => response.json())
      .then((json) => {
        this.NewsArticles = json.articles;
      })
      .catch((error) => {
        // console.error(error);
      });

    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      // console.log('users here', users);
      return (this.friends = users);
    });
    this.fetchCurrentUserFriends();
  }
  fetchAllStories() {

 this.fireStoreCollectionsService.getAllStories().subscribe(
      (stories: UserStories[]) => {
        // Update your component property with the fetched stories
        console.warn("this is all the stories",stories)
        this.ListOfStories = stories
      },
      (error) => {
        // Handle errors here, e.g., display an error message to the user or log the error
        console.error('Error fetching stories:', error);
      }
    );
  }

  fetchCurrentUserFriends(): IUsersInterface[] {
    const friendDocIds = this.currentUser!.friends;
    // console.warn(friendDocIds)
    const filteredUsers = this.recommedations!.filter((user) =>
      friendDocIds.includes(user.docId)
    );
    // console.log("friends",filteredUsers);
    return filteredUsers;
  }

  onTabSelected(selectedTabTitle: string) {
    // Handle the selected tab's title in the parent component
    console.log('Selected Tab:', selectedTabTitle);
    this.selectedTabTitle = selectedTabTitle;
    switch (selectedTabTitle) {
      case this.CHATS:
        this.searchPlaceholder = "Search chats..."
        break;
      case this.POSTS:
        this.searchPlaceholder = "Search posts..."
        break;
      case this.NEWS:
        this.searchPlaceholder = "Search news..."
        break;
    
      default:
        break;
    }
    // You can perform any further actions with the selected title here.
  }

  openModal($event: IUsersInterface) {
    this.openModalFlag = true;
    this.ModalData = $event;
  }

  closeModal($event: boolean) {
    if ($event == true) {
      this.openModalFlag = false;
    }
  }

  browseFriends() {
    this.router.navigate(['/', 'browse-friends']);
  }
  navigateTotrending() {
    this.router.navigate(['/', 'trending']);
  }

  navigateToFriendRequests() {
    this.router.navigate(['/', 'friend-requests']);
  }

  AddPost() {
    this.router.navigate(['/', 'add-post']);
  }
  addStoryNavigation() {
    this.router.navigate(['/', 'add-story']);
  }
  messagingNavigation(friend: IUsersInterface) {
    this.router.navigate(['/', 'messaging'], {
      queryParams: {
        friendData: JSON.stringify(friend),
      },
    });
  }

  toggleVisibility(visibility: string) {
    if (visibility == 'show') {
      this.showRecommendations = true;
      this.hide = true;
    } else {
      this.showRecommendations = false;
      this.hide = false;
    }
  }

  oldsearch(val: string): void {
    var originalPost = this.AllPosts;
    switch (this.selectedTabTitle) {
      case this.POSTS:
        if (val != '') {
          const filteredPosts = this.AllPosts.filter(
            (value) => value.title.includes(val) || value.title == val
          );
          this.AllPosts = filteredPosts;
        } else {
          this.fireStoreCollectionsService
            .getAllPoststags()
            .subscribe((posts) => {
              console.warn(posts);
              return (this.AllPosts = posts.filter(
                (v) => v.post !== '' && v.username !== ''
              ));
            });
        }
        break;
      case this.CHATS:
        if (val != '') {
          const filteredFriends = this.recommedations?.filter((value) =>
            value.name.includes(val)
          );
          this.recommedations = filteredFriends;
        } else {
          this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
            console.log('users here', users);
            return (this.recommedations = users);
          });
        }
        break;
      case this.NEWS:
        break;

      default:
        break;
    }
  }

  search(val: string) {
    const searchText = val.toLowerCase();

    switch (this.selectedTabTitle) {
      case this.CHATS:
        // Filter currentUser!.friends based on search text
        // this.filteredFriends = this.currentUser!.friends.filter(
        //   (friend) => friend.name.toLowerCase().includes(searchText)
        // );
        break;
      case this.POSTS:
        // Filter AllPosts based on search text
        if(searchText != ''){
          const filteredPosts = this.AllPosts.filter((value) => {
            const trimmedTitle = value.title.toLowerCase().trim();
            const trimmedVal = val.toLowerCase().trim();
          
            // Only filter when there is a non-empty search query
            return trimmedVal.length > 0 && (trimmedTitle.includes(trimmedVal) || trimmedTitle == trimmedVal);
          });
          
          this.AllPosts = filteredPosts;
        }else {
            this.fireStoreCollectionsService
              .getAllPoststags()
              .subscribe((posts) => {
                console.warn(posts);
                return (this.AllPosts = posts.filter(
                  (v) => v.post !== '' && v.username !== ''
                ));
              });
        }

        break;
      case this.NEWS:
        // Filter NewsArticles based on search text
       
        const filteredNews =  this.NewsArticles.filter(
          (article) => article.title.toLowerCase().includes(searchText)
          );
          this.NewsArticles = filteredNews
        break;
      default:
        break;
    }
  }

  addNewFriend(userNumber: string) {
    this.fireStoreCollectionsService
      .addFriend(this.currentUserId as string, userNumber)
      .subscribe((val) => {
        alert(val);
      });
  }

  MessageUser(friend:IUsersInterface){
    this.router.navigate(['/', 'messaging'], {
      queryParams: {
        friendData: JSON.stringify(friend),
      },
    });
  }

  MoreUserDetails(user:IUsersInterface){

  }
}
