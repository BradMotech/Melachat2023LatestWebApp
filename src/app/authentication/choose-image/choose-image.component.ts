import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';
import { AlertService } from 'src/app/shared/Services/alert.service';
import { FireStoreCollectionsServiceService } from 'src/app/shared/Services/fire-store-collections-service.service';

export interface CustomFile extends File {
  url?: string;
}
@Component({
  selector: 'app-choose-image',
  templateUrl: './choose-image.component.html',
  styleUrls: ['./choose-image.component.scss'],
})
export class ChooseImageComponent implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;
  selectedImages: any[] = [];
  selectedImage!: string;
  User!: IUsersInterface;
  constructor(
    private router: Router,
    private firebaseService: FireStoreCollectionsServiceService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe((params: any) => {
      // console.warn(params.comments);
      if (params) {
        this.User = <IUsersInterface>{
          InterestedIn: params.InterestedIn,
          availability: params.availability,
          bio: params.bio,
          blocked: params.blocked,
          created: params.created,
          dob: params.dob,
          friends: params.friends,
          image: params.image,
          language: params.language,
          location: params.location,
          name: params.name,
          notificationToken: params.notificationToken,
          password: params.password,
          phone: params.phone,
          requests: params.requests,
          suspended: params.suspended,
          username: params.username,
        };
      }
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
          var firebaseUrl = this.firebaseService
            .uploadPicture(base64String)
            .then((firebaseUrl) => {
              console.warn('download url here : ', firebaseUrl);
              this.uploadUserImage(firebaseUrl);
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
    this.firebaseService
      .updateduserprofile(this.User.phone, firebaseUrl)
      .subscribe((x) => {
        this.alertService.success("Uploaded profile picture successully")
      });
  }

  navigateBack() {
    this.router.navigate(['/authentication', 'login']);
  }
}
