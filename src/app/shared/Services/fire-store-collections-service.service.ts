import { Injectable } from '@angular/core';
import { Observable, finalize, forkJoin } from 'rxjs';
import { IUsersInterface } from '../Interfaces/IUsersInterface';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  Firestore,
  collectionData,
  collection,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { IHashTags } from '../Interfaces/IHashTags';
import { IPosts } from '../Interfaces/IPosts';
@Injectable({
  providedIn: 'root'
})
export class FireStoreCollectionsServiceService {

  constructor(
    private firestore: Firestore,
    public userAuth: Auth,) { }


    getAllUsers(): Observable<IUsersInterface[]> {
      const usersCollection = collection(this.firestore, 'Users');
      const usersQuery = query(usersCollection);
      return new Observable<IUsersInterface[]>((observer) => {
        getDocs(usersQuery)
        .then((querySnapshot) => {
          const users: IUsersInterface[] = [];
          querySnapshot.forEach((doc) => {
            users.push(doc.data() as IUsersInterface);
          });
            observer.next(users);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
            observer.complete();
          });
      });
    }

    getAllHashtags(): Observable<IHashTags[]> {
      const hashtagsCollection = collection(this.firestore, 'Hashtags');
      return new Observable<IHashTags[]>((observer) => {
        getDocs(hashtagsCollection)
          .then((querySnapshot) => {
            const hashtags: IHashTags[] = [];
            querySnapshot.forEach((doc) => {
              // Assuming each document in 'Hashtags' matches the IHashTags interface
              const hashtag = doc.data() as IHashTags;
              hashtags.push(hashtag);
            });
            observer.next(hashtags);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
            observer.complete();
          });
      });
    }

    getAllPoststags(): Observable<IPosts[]> {
      const postsCollection = collection(this.firestore, 'Posts');
      return new Observable<IPosts[]>((observer) => {
        getDocs(postsCollection)
          .then((querySnapshot) => {
            const posts: IPosts[] = [];
            querySnapshot.forEach((doc) => {
              // Assuming each document in 'Hashtags' matches the IHashTags interface
              const post = doc.data() as IPosts;
              posts.push(post);
            });
            observer.next(posts);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
            observer.complete();
          });
      });
    }

    getNewsArticles() {
      // const apiKey = '32054b2282e440a2bf45da9fcacb2040';
      // const url = `https://newsapi.org/v2/top-headlines?country=za&apiKey=${apiKey}`;
  
      // return this.http.get(url);
    }

    uploadPost(postData: IPosts): Observable<void> {
      const postsCollection = collection(this.firestore, 'Posts');
      return new Observable<void>((observer) => {
        addDoc(postsCollection, {
          ...postData,
          datePosted:new Date().toLocaleString('en-GB', { timeZone: 'UTC' }), // You might want to use serverTimestamp for accurate date
        })
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
            observer.complete();
          });
      });
    }

    // private addPostToFirestore(
    //   postsCollection: any, // You might need to define the correct type
    //   postData: IPosts,
    //   observer: any // You might need to define the correct type
    // ): void {
    //   addDoc(postsCollection, {
    //     ...postData,
    //     datePosted: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    //     // Add other properties as needed
    //   })
    //     .then(() => {
    //       observer.next();
    //       observer.complete();
    //     })
    //     .catch((error) => {
    //       observer.error(error);
    //       observer.complete();
    //     });
    // }
  
    // uploadPost(postData: IPosts, selectedImages?: FileList): Observable<void> {
    //   const postsCollection = collection(this.firestore, 'Posts');
    //   const storagePath = 'post-images'; // Update this with your desired storage path
  
    //   return new Observable<void>((observer) => {
    //     // Upload images to Firebase Storage
    //     if (selectedImages && selectedImages.length > 0) {
    //       const uploadTasks: Observable<any>[] = [];
    //       const storageUrls: string[] = []; // Store the Firebase Storage URLs
  
    //       Array.from(selectedImages).forEach((image: File, index: number) => {
    //         const path = `${storagePath}/${postData.user}-${index + 1}-${image.name}`;
    //         const storageRef = ref(this.storage, path);
    //         const task = uploadBytes(storageRef, image);
  
    //         // Collect upload tasks to wait for all uploads to complete
    //         const taskObservable = from(task);
    //         uploadTasks.push(taskObservable);
  
    //         // Get the download URL after the upload is complete
    //         taskObservable.subscribe(() => {
    //           // Directly get the download URL from the Reference
    //           storageRef.getDownloadURL().then((downloadURL: string) => {
    //             storageUrls.push(downloadURL);
  
    //             // If all images are uploaded, update the postData with URLs
    //             if (storageUrls.length === selectedImages.length) {
    //               postData.postImage = storageUrls;
  
    //               // Add post to Firestore
    //               this.addPostToFirestore(postsCollection, postData, observer);
    //             }
    //           });
    //         });
    //       });
    //     } else {
    //       // If no images to upload, just add post to Firestore
    //       this.addPostToFirestore(postsCollection, postData, observer);
    //     }
    //   });
    // }
  
   
}
