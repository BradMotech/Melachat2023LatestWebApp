import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';
import { IPosts } from 'src/app/shared/Interfaces/IPosts';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { AlertService } from 'src/app/shared/Services/alert.service';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import { selectCurrentUser, selectDocId } from 'src/app/shared/State/user.selectors';

interface CustomFile extends File {
  url?: string;
}
@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {
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
  PostContentFormControl: FormControl = new FormControl();
  PostContent: string = '';
  postText: string = '';
  selectedImages: any[] = [];
  currentUserId!: string | null;
  imagesConvertedToFirebaseUrl: any;
  currentUser!: IUsersInterface | null
  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private store: Store<UserState>,  private router: Router,private alertService: AlertService
  ) {

  }
  
  ngOnInit(): void {
    // Subscribe to changes in PostContent
    this.PostContentFormControl.valueChanges.subscribe((value) => {
      console.log('PostContent value changed:', value);
      this.postText = value;
    });

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
      console.log('Current user friends:', this.currentUser?.requests);
      
    });
  }

  generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  onSubmit(postData: IPosts): void {
    // Assuming you have a form or some way to collect post data
    this.postData.post = this.postText;
    this.postData.title = this.extractAndReturnTitle();
    if(this.imagesConvertedToFirebaseUrl){

      this.postData.postImage = this.imagesConvertedToFirebaseUrl
    };
    this.postData.username = this.currentUser?.username as string;
    this.postData.comments = [],
    this.postData.viewedBy = [],
    // this.postData.docId = this.generateGuid() as string
    // alert(this.extractAndReturnTitle());

    this.fireStoreCollectionsService.uploadPost(postData).subscribe(
      () => {
        console.log('Post uploaded successfully',postData);
        this.alertService.success('Post uploaded successfully!');
        this.router.navigate(['home'])
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

  // Function to trigger the file input when the "Upload image" button is clicked
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
  
}
