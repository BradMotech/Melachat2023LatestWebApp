import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CustomFile } from 'src/app/authentication/choose-image/choose-image.component';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';
import { UserState } from 'src/app/shared/State/user.reducer';
import { selectCurrentUser, selectDocId } from 'src/app/shared/State/user.selectors';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  @ViewChild('imageInput') imageInput!: ElementRef;
  currentUser!: IUsersInterface | null;
  currentUserId!: string | null;
  editUser:boolean = false;
  selectedImages: any[] = [];
  selectedImage!: string;
  User!: IUsersInterface;
  selectedImageString: string = '';
  UserNameFormControl = new FormControl();
  UserBioFormControl = new FormControl();
  userName: string = '';
  userBio: string = '';
  constructor( private fireStoreCollectionsService: FireStoreCollectionsServiceService,
    private store: Store<UserState>){

  }
  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    });

    this.store.select(selectDocId).subscribe((id) => {
      this.currentUserId = id;
      console.log('Current user id:', this.currentUserId);
    });

    this.UserNameFormControl.valueChanges.subscribe((val:string)=>{
      this.userName = val
    })
    this.UserBioFormControl.valueChanges.subscribe((val:string)=>{
      this.userBio = val
    })
  }

  EditUser(){
    this.editUser = true;
  }

  triggerImageInput(): void {
    // Access the native element using this.imageInput.nativeElement
    this.imageInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      const selectedImages: FileList = inputElement.files;
      // You can now handle the selected images, for example, upload them to a server

      // Read the contents of each image and create a data URL
      const fileArray: CustomFile[] = Array.from(selectedImages);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Add the data URL to the CustomFile object
          const base64String = (e.target?.result as string).split(',')[1];

          // Add the base64 string to the CustomFile object
          file.url = base64String;
          this.selectedImage = base64String;

          // Upload the base64 string to Firebase Storage
          var firebaseUrl = this.fireStoreCollectionsService
            .uploadPicture(base64String)
            .then((firebaseUrl) => {
              console.warn('download url here : ', firebaseUrl);
              this.selectedImageString  = firebaseUrl
              // this.uploadUserImage(firebaseUrl);
            })
            .catch((error) => {
              console.error(error);
            });
          console.warn(firebaseUrl);
        };
        reader.readAsDataURL(file);
      });

      // Set the updated array to selectedImages
      this.selectedImages = fileArray;
    }
  }
  uploadUserImage(firebaseUrl: string) {
    this.fireStoreCollectionsService
      .updateduserprofile(this.currentUser?.phone as string, firebaseUrl)
      .subscribe((x) => {});
  }

  saveUserDetails(){
    console.warn("this is it"+this.selectedImageString,this.currentUser?.phone)
    this.uploadUserImage(this.selectedImageString)
  }
}
