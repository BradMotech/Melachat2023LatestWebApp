import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IPosts } from 'src/app/shared/Interfaces/IPosts';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import { selectDocId } from 'src/app/shared/State/user.selectors';

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

  constructor(
    private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private store: Store<UserState>
  ) {}

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
  }
  onSubmit(postData: IPosts): void {
    // Assuming you have a form or some way to collect post data
    this.postData.post = this.postText;
    this.postData.title = this.extractAndReturnTitle();
    // alert(this.extractAndReturnTitle());

    this.fireStoreCollectionsService.uploadPost(postData).subscribe(
      () => {
        console.log('Post uploaded successfully');
        // Additional logic or redirection after successful upload
      },
      (error) => {
        console.error('Error uploading post:', error);
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
      // You can now handle the selected images, for example, upload them to a server
      console.log('Selected images:', selectedImages);

      // Read the contents of each image and create a data URL
      const fileArray: CustomFile[] = Array.from(selectedImages);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Add the data URL to the CustomFile object
          file.url = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });

      // Set the updated array to selectedImages
      this.selectedImages = fileArray;
    }
  }
}
