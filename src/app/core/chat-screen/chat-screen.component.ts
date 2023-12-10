import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable, map } from 'rxjs';
import { CustomFile } from 'src/app/authentication/choose-image/choose-image.component';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { ChatMessage, FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { selectCurrentUser, selectDocId } from 'src/app/shared/State/user.selectors';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss'],
})
export class ChatScreenComponent implements OnInit {
  @ViewChild('endOfChat') endOfChat!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  friendData: IUsersInterface | undefined;
  messages: any[] = [];
  currentUser!: IUsersInterface | null;
  currentUserId!: string | null;
  user$!:Observable<any>
  AllMessages: ChatMessage[] = [];
  MessageTextFormControl: FormControl = new FormControl();
  messageText: string = '';
  messages$!: Observable<ChatMessage[]>;
  selectedImages: any[] = [];
  imagesConvertedToFirebaseUrl: any;
  recommedations: IUsersInterface[] = [];
  originalRecommendations: IUsersInterface[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private firebaseService:FireStoreCollectionsServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.firebaseService.getAllUsers().subscribe((users) => {
      console.log('users here', users);
      this.originalRecommendations = users.filter(
        (userValue) => userValue.username && userValue.name && userValue.docId !== this.currentUserId
      )
      return (this.recommedations = this.originalRecommendations);
    });
    this.MessageTextFormControl.valueChanges.subscribe((val:string)=>{
      this.messageText = val
    })
    this.user$ = this.store.select(selectCurrentUser);
    
    this.user$.subscribe((user) => {
      this.currentUser = user;
    });

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });
    this.route.queryParams.subscribe((params) => {
      const friendDataString = params['friendData'];
      if (friendDataString) {
        this.friendData = JSON.parse(friendDataString);
      }
    });
   this.fetchMessages()
   this.scrollToBottom()
  }

  fetchMessages() {
    this.messages$ = this.firebaseService.getAllMessages().pipe(
      map((data: ChatMessage[]) => {
        // Update your local variable or state
        this.AllMessages = data;
  
        // Filter and return the messages
        return this.filterMessages(data, this.currentUserId as string, this.friendData?.docId as string);
      })
    );
  }

  navigateBack() {
    this.router.navigate(['/', 'home'], {
      queryParams: {
        InterestedIn: this.currentUser!.InterestedIn,
        availability: this.currentUser!.availability,
        bio: this.currentUser!.bio,
        blocked: this.currentUser!.blocked,
        created: this.currentUser!.created,
        dob: this.currentUser!.dob,
        friends: this.currentUser!.friends,
        image: this.currentUser!.image,
        language: this.currentUser!.language,
        location: this.currentUser!.location,
        name: this.currentUser!.name,
        notificationToken: this.currentUser!.notificationToken,
        password: this.currentUser!.password,
        phone: this.currentUser!.phone,
        requests: this.currentUser!.requests,
        suspended: this.currentUser!.suspended,
        username: this.currentUser!.username,
      },
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }
  
  scrollToBottom() {
    console.log('Scrolling to bottom...');
    setTimeout(() => {
      if (this.endOfChat) {
        console.log('Element found:', this.endOfChat.nativeElement);
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
        // this.endOfChat.nativeElement.scrollIntoView();
      } else {
        console.log('Element not found.');
      }
    }, 100);
  }
  filterMessages(messagesList: ChatMessage[], userId: string, sentToId: string): ChatMessage[] {
    const filteredMessages = messagesList.filter(message => 
      (message.user._id === this.currentUserId && message.sentTo === sentToId) ||
      (message.user._id === sentToId && message.sentTo === this.currentUserId)
    );
  
    // Sort messages by timestamp (assuming createdAt is the timestamp property)
    return filteredMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  // filterMessages(messagesList: ChatMessage[], userId: string, sentToId: string): ChatMessage[] {
  //   console.warn(messagesList.filter(message => message.user._id === this.currentUserId && message.sentTo === sentToId))
  //   return messagesList.filter(message => message.user._id === this.currentUserId && message.sentTo === sentToId || message.user._id === sentToId && message.sentTo === this.currentUserId);
  // }
  
  sendMessage() {
    const messageData = <ChatMessage>{
      createdAt: moment().format('DD-MM-YYYY'),
      replyImg: '',
      image: '',
      replyVn: '',
      vn: '',
      deleted: [], // Assuming 'deleted' is an array of strings
      user: {
        avatar: this.currentUser?.image,
        _id: this.currentUserId,
        name: this.currentUser?.username,
      },
      _id: this.currentUserId,
      text:  this.messageText,
      replyTo: this.friendData?.docId,
      sentTo: this.friendData?.docId,
      replyMsg: "",
      read: [],
      images:this.selectedImages.length ? this.selectedImages : []
    };

    // this.firebaseService.sendMessage(messageData)
    //   .then(() => {
    //     console.log('Message sent successfully',messageData);
    //     this.scrollToBottom()
    //     // this.messages.push(messageData);
    //     // this.fetchMessages()
    //     this.MessageTextFormControl.setValue('');
    //     this.selectedImages = []
    //   })
    //   .catch((error) => {
    //     console.error('Error sending message:', error);
    //   });
    this.firebaseService.sendMessage(messageData)
    .then(() => {
      console.log('Message sent successfully', messageData);
      // this.messages.push(messageData); // Add the new message to the local array
      this.MessageTextFormControl.setValue('');
      this.selectedImages = [];
      this.scrollToBottom();
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
  }

  triggerImageInput(): void {
    // Access the native element using this.imageInput.nativeElement
    this.imageInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      const selectedImages: FileList = inputElement.files;
      const fileArray: CustomFile[] = Array.from(selectedImages);
  
      // Reset the array
      this.imagesConvertedToFirebaseUrl = [];
  
      // Create a function to upload an image and return a Promise
      const uploadImage = (file: CustomFile): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = (e.target?.result as string).split(',')[1];
  
            this.firebaseService
              .uploadPicture(base64String)
              .then((firebaseUrl) => {
                resolve(firebaseUrl);
              })
              .catch((error) => {
                reject(error);
              });
          };
          reader.readAsDataURL(file);
        });
      };
  
      // Process each file sequentially
      const processFiles = async () => {
        for (const file of fileArray) {
          try {
            const url = await uploadImage(file);
            this.imagesConvertedToFirebaseUrl.push(url);
          } catch (error) {
            console.error(error);
          }
        }
      };
  
      // Start processing files
      processFiles();
      this.selectedImages = this.imagesConvertedToFirebaseUrl
    }
  }

  showImages(images: string[]) {

    this.router.navigate(['/', 'image-viewer'], {
      queryParams: {
        images: JSON.stringify(images),
      },
    });
   
  }

  userProfileNavigation(friend: IUsersInterface | undefined) {
    this.router.navigate(['friend-profile'], {
      queryParams: {
        friendData: JSON.stringify(friend),
        usersList:JSON.stringify(this.recommedations)
      },
    });
  }
}
