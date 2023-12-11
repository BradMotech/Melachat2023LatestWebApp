import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { IHashTags } from 'src/app/shared/Interfaces/IHashTags';
import { IPosts } from 'src/app/shared/Interfaces/IPosts';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { AlertService } from 'src/app/shared/Services/alert.service';
import {
  ChatMessage,
  FireStoreCollectionsServiceService,
  UserStories,
} from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import {
  selectCurrentUser,
  selectDocId,
} from 'src/app/shared/State/user.selectors';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { headerAds } from 'src/app/shared/promoted-tabs/promoted-tabs.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  recommedations: IUsersInterface[] = [];
  hashtags: IHashTags[] | undefined;
  readonly CHATS = 'Chats';
  readonly POSTS = 'Posts';
  readonly NEWS = 'News';
  selectedTabTitle: string = this.CHATS;
  ModalData!: IUsersInterface;
  openModalFlag!: boolean;
  AllPosts: IPosts[] = [];
  originalAllPosts: IPosts[] = [];
  friends!: IUsersInterface[] | undefined;
  ListOfStories!: UserStories[];
  NewsArticles: any[] = [];
  OriginalNewsArticles: any[] = [];
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
  searchPlaceholder: string = 'Search users...';
  OriginalUserFriends: IUsersInterface[] = [];
  UserFriends: IUsersInterface[] = [];
  currentUserProfileDetails$: any;
  friendRequestUserId!: string;
  friendRequestUserNumber!: string;
  currentUserFriendRequests: string[] = [];
  CurrentUserStories: UserStories[] = [];
  hideAds: boolean = false;
  showAds: boolean = false
  adsHeaders:headerAds[] = [{name:"Clothing",svg:""},{name:"Alcohol",svg:""}]
  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router,
    private store: Store<UserState>,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    // this.fireStoreCollectionsService.deleteOldStories()
    this.fetchAllStories();  
    // this.store.select(selectCurrentUser).subscribe((user) => {
    //   this.currentUser = user;
    //   console.log('Current user:', this.currentUser);
    //   console.log('Current user friends:', this.currentUser?.requests);
    // });
    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      // console.log('users here', users);
      return (this.recommedations = users);
    });
    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      // console.log('users here', users);
      this.currentUser = users.filter(x=> x.docId == this.currentUserId)[0];
      this.getFriendLastMessage()
      this.currentUserFriendRequests = this.currentUser.requests.filter(x => x !== this.currentUser?.docId)
      return (users.filter(x=> x.docId == this.currentUserId));
    });

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });


    // this.currentUserProfileDetails$ = this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
    //   // console.log('users here', users);
    //   return (users.filter(x=> x.docId == this.currentUserId));
    // });
    this.fireStoreCollectionsService.getAllHashtags().subscribe((hashtags) => {
      console.warn('hastags right heereee', hashtags);
      this.hashtags = hashtags;
    });

    this.fireStoreCollectionsService.getAllPoststags().subscribe((posts) => {
      // Sort the posts by dateAdded in descending order (most recent first)
      console.warn('All posts here', posts);
      this.originalAllPosts = posts
        .filter((v) => v.post !== '' && v.username !== '' && v.title != '')
        .sort((a, b) => {
          const dateA = new Date(a.datePosted).getTime();
          const dateB = new Date(b.datePosted).getTime();
          return dateB - dateA;
        });
      this.AllPosts = this.originalAllPosts;
    });

    fetch(
      'https://newsapi.org/v2/top-headlines?country=za&apiKey=32054b2282e440a2bf45da9fcacb2040'
    )
      .then((response) => response.json())
      .then((json) => {
        this.OriginalNewsArticles = json.articles;
        this.NewsArticles = this.OriginalNewsArticles;
      })
      .catch((error) => {
        // console.error(error);
      });

    this.fireStoreCollectionsService.getAllUsers().subscribe((users) => {
      // console.log('users here', users);
      return (this.friends = users);
    });
    // this.fetchCurrentUserFriends();
    this.UserFriends = this.fetchCurrentUserFriends('');
  }
  fetchAllStories() {
    this.fireStoreCollectionsService.getAllStories().subscribe(
      (stories: UserStories[]) => {
        // Update your component property with the fetched stories
        console.warn('this is all the stories', stories);
        this.ListOfStories = stories.filter(x=>x.user != this.currentUserId);
        this.CurrentUserStories = stories.filter(x => x.user == this.currentUserId)
      },
      (error) => {
        // Handle errors here, e.g., display an error message to the user or log the error
        console.error('Error fetching stories:', error);
      }
    );

    // this.fireStoreCollectionsService.getTrendingHashtags().subscribe((v)=>{
    //   console.warn(v);
    //   this.hashtags = v
    // })
  }

  getFriendLastMessage(){
    // debugger
    const friendDocIds = this.currentUser!.friends;
    let filteredUsers = this.recommedations!.filter((user) =>
    friendDocIds.includes(user.docId)
    );
    this.UserFriends = filteredUsers;
    // debugger
    if(this.UserFriends!.length){
      
      this.UserFriends?.forEach(currentUserFriend => {
        console.log("hey there")
      this.getMessages(currentUserFriend);

      })
    }
  
    
     
  }

  getMessages(currentUserFriend: IUsersInterface) {
    this.fireStoreCollectionsService.getAllMessages().pipe(
      map((data: ChatMessage[]) => {
        console.log(currentUserFriend);
        // Update your local variable or state
        // this.AllMessages = data;
        // Filter and return the messages
        return this.filterMessages(data, this.currentUserId as string, currentUserFriend.docId as string);
      })
    ).subscribe(messages => {
      console.log("hey there", messages);
  
      // Update UserFriends based on messages
      this.UserFriends = this.UserFriends!.map(friend => {

        const friendMessages = messages.filter(msg => {
          console.log("friend and msg ids : ",friend.docId + " msg id : "+ msg.replyTo)
          return  msg.user._id=== friend.docId});
        const lastMessage = friendMessages.length > 0 ? friendMessages[friendMessages.length - 1].text : '';
        return {
          ...friend,
          messages: lastMessage
        };
      });
  
      console.log("friend data here", this.UserFriends);
    });
  }
  
  filterMessages(messagesList: ChatMessage[], userId: string, sentToId: string): ChatMessage[] {
    console.warn("messages here ",messagesList.filter(message => message.user._id === this.currentUserId && message.sentTo === sentToId))
    return messagesList.filter(message => message.user._id === this.currentUserId && message.sentTo === sentToId || message.user._id === sentToId && message.sentTo === this.currentUserId);
  }

  fetchCurrentUserFriendsDefault(): IUsersInterface[] {
    const friendDocIds = this.currentUser!.friends;
    // console.warn(friendDocIds)
    const filteredUsers = this.recommedations!.filter((user) =>
      friendDocIds.includes(user.docId)
    );

    // console.log("friends",filteredUsers);
    return filteredUsers;
  }
  
  fetchCurrentUserFriends(searchTerm: string = ''): IUsersInterface[] {
    const friendDocIds = this.currentUser!.friends;
    let filteredUsers = this.recommedations!.filter((user) =>
      friendDocIds.includes(user.docId)
    );

    // Apply additional filtering based on the search term
    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerCaseSearchTerm) ||
          user.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    } else {
      filteredUsers = this.recommedations!.filter((user) =>
        friendDocIds.includes(user.docId)
      );
    }

    return filteredUsers;
  }

  onTabSelected(selectedTabTitle: string) {
    // Handle the selected tab's title in the parent component
    console.log('Selected Tab:', selectedTabTitle);
    this.selectedTabTitle = selectedTabTitle;
    switch (selectedTabTitle) {
      case this.CHATS:
        this.searchPlaceholder = 'Search chats...';
        break;
      case this.POSTS:
        this.searchPlaceholder = 'Search posts...';
        break;
      case this.NEWS:
        this.searchPlaceholder = 'Search news...';
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

  toggleAdsVisibility(visibility: string) {
    if (visibility == 'show') {
      this.showAds = true;
      this.hideAds = true;
    } else {
      this.showAds = false;
      this.hideAds = false;
    }
  }

  search(val: string) {
    const searchText = val.toLowerCase();

    switch (this.selectedTabTitle) {
      case this.CHATS:
        // Filter currentUser!.friends based on search text
        this.UserFriends = this.fetchCurrentUserFriends(searchText);
        break;
      case this.POSTS:
        // Filter AllPosts based on search text
        const trimmedSearchText = searchText.toLowerCase().trim();

        // If the search term is empty, restore the original list
        if (!trimmedSearchText) {
          this.AllPosts = this.originalAllPosts;
          return;
        }

        // Filter posts based on the search term
        const filteredPosts = this.originalAllPosts?.filter((post) => {
          const trimmedTitle = post.title.toLowerCase().trim();

          // Only filter when there is a non-empty search query
          return (
            trimmedSearchText.length > 0 &&
            (trimmedTitle.includes(trimmedSearchText) ||
              trimmedTitle == trimmedSearchText)
          );
        });

        this.AllPosts = filteredPosts;
        break;
      case this.NEWS:
        // Filter NewsArticles based on search text
        const SearchText = searchText.toLowerCase().trim();

        // If the search term is empty, restore the original list
        if (!SearchText) {
          this.NewsArticles = this.OriginalNewsArticles;
          return;
        }

        // Filter posts based on the search term
        const filteredNews = this.originalAllPosts?.filter((article) => {
          const trimmedNewsTitle = article.title.toLowerCase().trim();

          // Only filter when there is a non-empty search query
          return (
            SearchText.length > 0 &&
            (trimmedNewsTitle.includes(SearchText) ||
              trimmedNewsTitle == SearchText)
          );
        });

        this.NewsArticles = filteredNews;
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

  MessageUser(friend: IUsersInterface) {
    this.router.navigate(['/', 'messaging'], {
      queryParams: {
        friendData: JSON.stringify(friend),
      },
    });
  }

  MoreUserDetails(user: IUsersInterface) {}

  addNewFriendRequest(userId: string, userNumber: string) {
    this.friendRequestUserId = userId;
    this.friendRequestUserNumber = userNumber;
    this.fireStoreCollectionsService
      .addFriend(this.currentUserId as string, userNumber)
      .subscribe((val) => {
        // alert(val);
      });
    this.fireStoreCollectionsService
      .addFriend(userId, userNumber)
      .subscribe((val) => {
        // alert(val);
      });
  }
  
  confirmFriendRequest(){
    this.addNewFriendRequest(this.friendRequestUserId,this.friendRequestUserNumber);
    this.alertService.success(
      'Friend requested successully sent to ' + this.friendRequestUserNumber
    );
  }

  ViewStories(data:UserStories){
    console.log(data)
    this.router.navigate(['/', 'view-stories'], {
      queryParams: {
        storiesData: JSON.stringify(data),
      },
    });
  }

  userProfileNavigation(friend: IUsersInterface) {
    this.router.navigate(['friend-profile'], {
      queryParams: {
        friendData: JSON.stringify(friend),
        usersList:JSON.stringify(this.recommedations)
      },
    });
  }

  navigateToPromoteItem(){
    this.router.navigate(['promote-item']);
  }
}
