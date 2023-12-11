import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomFile } from 'src/app/authentication/choose-image/choose-image.component';
import { IPosts } from 'src/app/shared/Interfaces/IPosts';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { AlertService } from 'src/app/shared/Services/alert.service';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import { selectCurrentUser, selectDocId } from 'src/app/shared/State/user.selectors';

@Component({
  selector: 'app-promote-item-main',
  templateUrl: './promote-item-main.component.html',
  styleUrls: ['./promote-item-main.component.scss']
})
export class PromoteItemMainComponent {
  @ViewChild('imageInput') imageInput!: ElementRef;
  postData: IPosts = {
    // Initialize with default values or an empty object
    comments: {},
    datePosted: '',
    likedBy: [],
    likes: 0,
    originalPost: '',
    post: '',
    postImage: [],
    postVideo: [],
    title: '',
    user: '',
    userImage: '',
    username: '',
    viewedBy: [],
    docId:''
    // ... any other properties you might have in your IPosts interface
  };
  // recommedations: IUsersInterface[] | undefined;
  ModalData!: IUsersInterface;
  openModalFlag!: boolean;
  currentUserId!: string | null;
  AllPosts!: IPosts[];
  PostContentFormControl: FormControl = new FormControl();
  PostContent: string = '';
  postText: string = '';
  selectedImages: any[] = [];
  imagesConvertedToFirebaseUrl: any;
  currentUser!: IUsersInterface | null
  filterByTrend: string = "";

  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private router: Router,
    private store: Store<UserState>,
    private alertService: AlertService
  ) {}
  
  ngOnInit(): void {

    this.router.routerState.root.queryParams.subscribe((params: any) => {
      if (params) {
        this.filterByTrend = params.hashtag
      }})

    this.PostContentFormControl.valueChanges.subscribe((value) => {
      console.log('PostContent value changed:', value);
      this.postText = value;
    });
    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      // console.log('Current user id:', this.currentUserId);
    });

    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      // console.log('Current user:', this.currentUser);
      // console.log('Current user friends:', this.currentUser?.requests);
      
    });

    this.fireStoreCollectionsService.getAllPoststags().subscribe((posts) => {
      // Sort the posts by dateAdded in descending order (most recent first)
      if(this.filterByTrend !== ""){
        this.AllPosts = posts
        .filter((v) => v.post !== '' && v.username !== '' && v.title != '' && v.post.includes(this.filterByTrend))
        .sort((a, b) => {
          const dateA = new Date(a.datePosted).getTime();
          const dateB = new Date(b.datePosted).getTime();

          return dateB - dateA;
        });
      }else{
        this.AllPosts = posts
          .filter((v) => v.post !== '' && v.username !== '' && v.title != '')
          .sort((a, b) => {
            const dateA = new Date(a.datePosted).getTime();
            const dateB = new Date(b.datePosted).getTime();
  
            return dateB - dateA;
          });
      }
    });
    // console.log('all posts:', this.AllPosts);
  }

  openModal($event: IUsersInterface) {
    this.openModalFlag = true;
    this.ModalData = $event;
  }

  addNewFriend(userId: string, userNumber: string) {
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
    this.alertService.success(
      'Friend requested successully sent to ' + userNumber
    );
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
  
            this.fireStoreCollectionsService
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
  onSubmit(postData: IPosts): void {
    // Assuming you have a form or some way to collect post data
    this.postData.post = this.postText;
    this.postData.user = this.currentUserId as string;
    this.postData.title = this.extractAndReturnTitle();
    if(this.imagesConvertedToFirebaseUrl){

      this.postData.postImage = this.imagesConvertedToFirebaseUrl
    };
    this.postData.username = this.currentUser?.username as string;
    this.postData.comments = []
    // this.postData.docId = this.generateGuid() as string
    // alert(this.extractAndReturnTitle());

    this.fireStoreCollectionsService.promoteItem(postData).subscribe(
      () => {
        console.log('Promo uploaded successfully',postData);
        this.alertService.success('Promo uploaded successfully!');
        this.PostContentFormControl.setValue('');
        if(this.selectedImages.length){
          this.selectedImages = []
        }
        // this.router.navigate(['home'])
        // Additional logic or redirection after successful upload
      },
      (error) => {
        console.error('Error uploading post:', error);
        this.alertService.error('Post upload failed!',error);
        // Handle error accordingly
      }
    );
  }

  private extractAndReturnTitle(): string {
    // Extract the first sentence from postData.post
    const sentences = this.postText.split(/[.!?]/);
    if (sentences.length > 0) {
      return sentences[0].trim();
    } else {
      // If no sentences found, return the entire post as the title
      return this.postText.trim();
    }
  }

}
