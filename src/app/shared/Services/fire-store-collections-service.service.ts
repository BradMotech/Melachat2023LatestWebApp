import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, catchError, finalize, forkJoin, from, map, switchMap, throwError } from 'rxjs';
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
  doc,
  updateDoc,
  arrayUnion,
  CollectionReference,
  DocumentData,
  DocumentReference,
  arrayRemove,
  onSnapshot,
  runTransaction,
  deleteDoc,
} from '@angular/fire/firestore';

import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { IHashTags } from '../Interfaces/IHashTags';
import { IPosts } from '../Interfaces/IPosts';
import * as CryptoJS from 'crypto-js';
import { UserState } from '../State/user.reducer';
import { Store } from '@ngrx/store';
import { setDocId } from '../State/user.actions';
import { StorageModule, getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import * as moment from 'moment';
import { Storage } from '@angular/fire/storage';

export interface Story {
  id: number;
  url: string;
  type: 'image' | 'text';
  duration: number;
  isReadMore: boolean;
  storyData: {
    uploadedAt: string;
    viewedBy: string[];
  };
  storytext:string;
  background?: string;
}

// Interface for a user's stories
export interface UserStories {
  username: string;
  profile: string;
  user: string;
  count: number;
  stories: Story[];
}
export interface ChatMessage {
  createdAt: any;
  replyImg: string;
  image: string;
  replyVn: string;
  vn: string;
  deleted: string[]; // Assuming 'deleted' is an array of strings
  user: {
    avatar: string;
    _id: string;
    name: string;
  };
  _id: string;
  text: string;
  replyTo: string;
  sentTo: string;
  replyMsg: string;
  read: string[];
  images:string[]
}
@Injectable({
  providedIn: 'root',
})
export class FireStoreCollectionsServiceService {
  constructor(
    private firestore: Firestore,
    public userAuth: Auth,
    private store: Store<UserState>,
    private readonly storage: Storage
  ) {}

  private currentUserSubject = new BehaviorSubject<IUsersInterface | null>(
    null
  );
  currentUser$: Observable<IUsersInterface | null> =
    this.currentUserSubject.asObservable();

  setCurrentUser(user: IUsersInterface) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): IUsersInterface | null {
    return this.currentUserSubject.value;
  }

  signInWithPhoneNumber(phoneNumber: string, password: string): Promise<{}> {
    return new Promise((resolve, reject) => {

      const usersCollection = collection(this.firestore, 'Users');
      const usersQuery = query(
        usersCollection,
        where('phone', '==', "+27"+phoneNumber)
      );

      getDocs(usersQuery)
        .then((querySnapshot) => {
          if (querySnapshot.size <= 0) {
            // Handle invalid phone number
            console.warn('Invalid phone number', phoneNumber);
            reject('Invalid phone number');
          } else {
            console.warn('User data exist:');
            // Phone number exists, now check the password
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              const docId = doc.id;
              this.store.dispatch(setDocId({ docId }));
              localStorage.setItem('userId', docId);
              let userPasswordCipher = userData['password']
              let userPasswordKey = userData['password']
              console.warn('User password:', userPasswordCipher['ciphertext']);
              console.warn('User key:', userPasswordKey['key']);

              // Check if users password matches
              // Uncomment the following lines when you decide to use them

              // if (userData['password'] && userData['password'].ciphertext && userData['password'].key) {
                let originalText = '';
              // try {
                // let bytes = CryptoJS.AES.decrypt(
                //   (userData as IUsersInterface).password['cipherText'],
                //   (userData as IUsersInterface).password['key']
                // ).toString();

                // Rest of the decryption logic
                let bytes = CryptoJS.AES.decrypt(
                  userPasswordCipher['ciphertext'].toString(),
                  userPasswordKey['key'].toString()
                );
                originalText = bytes.toString(CryptoJS.enc.Utf8);
                console.log("original",originalText);
              // } catch (error) {
              //   console.error('Error during decryption:', error);
              // }
              if (originalText == password) {
                // Successful sign-in
                resolve(userData);
              } else {
                // Handle invalid password
                reject('Invalid password');
              }
              // } else {
              //   console.error('Invalid password data:', userData['password']);
              //   // Handle the error appropriately
              // }
            });

            // If you reached here, it means the password check logic was not triggered
            // Handle this case if needed, e.g., if there was an issue with the data
            console.warn('Password check not triggered');
            reject('Password check not triggered');
          }
        })
        .catch((error) => {
          // Handle sign-in error
          console.error('Error during sign-in:', error);
          reject(error.message);
        });
    });
  }

  getAllUsers(): Observable<IUsersInterface[]> {
    const usersCollection = collection(this.firestore, 'Users');
    const usersQuery = query(usersCollection);
  
    return new Observable<IUsersInterface[]>((observer: Observer<IUsersInterface[]>) => {
      const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
        const users: IUsersInterface[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as IUsersInterface;
          const userDataWithId: IUsersInterface = {
            ...userData,
            docId: doc.id, // Include the document ID
          };
          users.push(userDataWithId);
        });
  
        observer.next(users);
      });
  
      // Return an unsubscribe function to clean up the subscription when it's no longer needed
      return () => unsubscribe();
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
      const unsubscribe = onSnapshot(postsCollection, (querySnapshot) => {
        const posts: IPosts[] = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data() as IPosts;
          post.docId = doc.id; // Add the docId property
          posts.push(post);
        });
        this.analyzeAndUploadTrendingHashtags(posts);
        observer.next(posts);
      }, (error) => {
        observer.error(error);
      });
  
      // Return an unsubscribe function to clean up the subscription when it's no longer needed
      return () => unsubscribe();
    });
  }
  getAllPromostags(): Observable<IPosts[]> {
    const postsCollection = collection(this.firestore, 'Promoted');
  
    return new Observable<IPosts[]>((observer) => {
      const unsubscribe = onSnapshot(postsCollection, (querySnapshot) => {
        const posts: IPosts[] = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data() as IPosts;
          post.docId = doc.id; // Add the docId property
          posts.push(post);
        });
        this.analyzeAndUploadTrendingHashtags(posts);
        observer.next(posts);
      }, (error) => {
        observer.error(error);
      });
  
      // Return an unsubscribe function to clean up the subscription when it's no longer needed
      return () => unsubscribe();
    });
  }

  private async analyzeAndUploadTrendingHashtags(posts: IPosts[]): Promise<void> {
    const hashtagCountMap: Map<string, number> = new Map();
  
    // Analyze hashtags in posts
    posts.forEach((post) => {
      const hashtags = this.extractHashtags(post.post); // Replace with your own logic to extract hashtags
  
      // Count hashtags
      const uniqueHashtags = new Set(hashtags); // Use a Set to ensure uniqueness
      uniqueHashtags.forEach((hashtag) => {
        const count = hashtagCountMap.get(hashtag) || 0;
        hashtagCountMap.set(hashtag, count + 1);
      });
    });
  
    // Upload trending hashtags to "Trending" collection
    const trendingCollectionRef = collection(this.firestore, 'Trending');
  
    for (const [hashtag, count] of hashtagCountMap.entries()) {
      // Check if the hashtag already exists in Trending
      const existingDocQuery = query(
        trendingCollectionRef,
        where('hashtag', '==', hashtag)
      );
  
      const existingDocs = await getDocs(existingDocQuery);
  
      if (existingDocs.size > 0) {
        // Hashtag exists, update the count
        const existingDoc = existingDocs.docs[0];
        const existingDocRef = doc(trendingCollectionRef, existingDoc.id);
        await updateDoc(existingDocRef, { count });
      } else if (count > 2) {
        // Hashtag doesn't exist, add a new document
        await addDoc(trendingCollectionRef, { hashtag, count });
      }
    }
  }
  

  private extractHashtags(content: string): string[] {
    // Replace this with your own logic to extract hashtags from post content
    // Here's a simple example using a regular expression
    const regex = /#(\w+)/g;
    return (content.match(regex) || []).map((match) => match.toLowerCase());
  }

  // getTrendingHashtags(): Observable<{ hashtag: string; count: number }[]> {
  //   const trendingCollection = collection(this.firestore, 'Trending');

  //   return new Observable<{ hashtag: string; count: number }[]>((observer) => {
  //     const unsubscribe = onSnapshot(trendingCollection, (querySnapshot) => {
  //       const trendingHashtags: { hashtag: string; count: number }[] = [];
  //       querySnapshot.forEach((doc) => {
  //         const trendingData = doc.data();
  //         trendingHashtags.push({
  //           hashtag: trendingData['hashtag'],
  //           count: trendingData['count'],
  //         });
  //       });

  //       observer.next(trendingHashtags);
  //     }, (error) => {
  //       observer.error(error);
  //     });

  //     // Return an unsubscribe function to clean up the subscription when it's no longer needed
  //     return () => unsubscribe();
  //   });
  // }

  getAllMessages(): Observable<ChatMessage[]> {
    const messagesCollection = collection(this.firestore, 'Messages');
  
    return new Observable<ChatMessage[]>((observer) => {
      const unsubscribe = onSnapshot(messagesCollection, (querySnapshot) => {
        const messages: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
          const message = doc.data() as ChatMessage;
          message._id = doc.id;
          messages.push(message);
        });
        observer.next(messages);
      }, (error) => {
        observer.error(error);
      });
  
      // Cleanup function to unsubscribe when the observable is unsubscribed
      return () => unsubscribe();
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
        datePosted: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }), // You might want to use serverTimestamp for accurate date
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
  promoteItem(postData: IPosts): Observable<void> {
    const postsCollection = collection(this.firestore, 'Promoted');
    return new Observable<void>((observer) => {
      addDoc(postsCollection, {
        ...postData,
        datePosted: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }), // You might want to use serverTimestamp for accurate date
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

  deletePost(postId: string): Observable<void> {
    const postDoc = doc(this.firestore, 'Posts', postId);

    return new Observable<void>((observer) => {
      deleteDoc(postDoc)
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

  addCommentToPost(postId: string, userId: string, comment: string, senderId: string, username: string, userImage: string): Observable<void> {
    const postDoc = doc(this.firestore, 'Posts', postId);
  
    return from(getDoc(postDoc)).pipe(
      switchMap((postSnapshot) => {
        if (postSnapshot.exists()) {
          const post = postSnapshot.data() as IPosts;
          const currentComments = post.comments || [];
          const newComment = {
            userId: userId,
            comment: comment,
            username: username,
            userImage: userImage,
            postedAt: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
          };
          const updatedComments = [...currentComments, newComment];
  
          return from(updateDoc(postDoc, { comments: updatedComments })).pipe(
            map(() => undefined), // Map the result to void
            catchError((error) => {
              throw error; // Re-throw the error
            })
          );
        } else {
          throw new Error('Post not found');
        }
      }),
      catchError((error) => {
        throw error; // Re-throw the error
      })
    );
  }

  removeCommentFromPost(postId: string, commentId: string): Observable<void> {
    const postDoc = doc(this.firestore, 'Posts', postId);

    return from(getDoc(postDoc)).pipe(
      switchMap((postSnapshot) => {
        if (postSnapshot.exists()) {
          const post = postSnapshot.data() as IPosts;
          const currentComments = post.comments || [];
          const updatedComments = currentComments.filter((comment:any) => comment.commentId !== commentId);

          return from(updateDoc(postDoc, { comments: updatedComments })).pipe(
            map(() => undefined),
            catchError((error) => {
              throw error;
            })
          );
        } else {
          throw new Error('Post not found');
        }
      }),
      catchError((error) => {
        throw error;
      })
    );
  }
  
  addFriend(userId: string, friendNumber: string): Observable<void> {
    console.log('user id ',userId);
    console.log('friend number ',friendNumber);
    const usersCollection = 'Users';
    const queryRef = query(collection(this.firestore, usersCollection), where('phone', '==', friendNumber));

    return new Observable<void>((observer: Observer<void>) => {
      from(getDocs(queryRef)).pipe(
        switchMap((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log('friend does not exist')
            // Friend not found
            // You can handle this case differently, like showing an error message.
            observer.complete(); // No error, just complete the observer
            return throwError('Friend not found');
          } else {
            // Friend found
            const userDoc: DocumentReference<DocumentData> = querySnapshot.docs[0].ref;
console.log('friend found',userDoc)
            // Update the friend's requests array
            return from(updateDoc(userDoc, {
              requests: arrayUnion(userId),
            }));
          }
        }),
        catchError((error) => {
          console.error('Error adding friend:', error);
          observer.error(error);
          return throwError(error);
        })
      ).subscribe(
        () => {
          observer.next();
          observer.complete();
        }
      );
    });
  }


  ApproveFriend(user: IUsersInterface, currentUserNumber: string, currentUserId:string): Observable<void> {
    console.log('user id ',user.docId);
    console.log('friend number ');
    const usersCollection = 'Users';
    const queryRef = query(collection(this.firestore, usersCollection), where('phone', '==', user.phone));

    return new Observable<void>((observer: Observer<void>) => {
      from(getDocs(queryRef)).pipe(
        switchMap((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log('friend does not exist')
            // Friend not found
            // You can handle this case differently, like showing an error message.
            observer.complete(); // No error, just complete the observer
            return throwError('Friend not found');
          } else {
            // Friend found
            const userDoc: DocumentReference<DocumentData> = querySnapshot.docs[0].ref;
            console.log('friend found',userDoc)
            console.log('current user id',currentUserId)
            
            // Update the friend's requests array
            return from(updateDoc(userDoc, {
              friends: arrayUnion(currentUserId),
            }));
          }
        }),
        catchError((error) => {
          console.error('Error adding friend:', error);
          observer.error(error);
          return throwError(error);
        })
      ).subscribe(
        () => {
          observer.next();
          observer.complete();
        }
      );
    });
    
  }
  addUserToCurrentUser(currentUserNumber:string,UserId:string) {
    const usersCollection = 'Users';
    const queryRef = query(collection(this.firestore, usersCollection), where('phone', '==', currentUserNumber));
    
    return new Observable<void>((observer: Observer<void>) => {
      from(getDocs(queryRef)).pipe(
        switchMap((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log('current user does not exist')
            // Friend not found
            // You can handle this case differently, like showing an error message.
            observer.complete(); // No error, just complete the observer
            return throwError('current user not found');
          } else {
            // Friend found
            console.warn("called")
            const userDoc: DocumentReference<DocumentData> = querySnapshot.docs[0].ref;
            console.log('current user found',userDoc)
            // Update the friend's requests array
            return from(updateDoc(userDoc, {
              friends: arrayUnion(UserId),
            }));
          }
        }),
        catchError((error) => {
          console.error('Error adding friend:', error);
          observer.error(error);
          return throwError(error);
        })
      ).subscribe(
        () => {
          observer.next();
          observer.complete();
        }
      );
    });
  }

  addUserIdToLikedBy(postId: string, userId: string): Observable<void> {
    const postDoc = doc(this.firestore, 'Posts', postId);
  
    return new Observable<void>((observer) => {
      const unsubscribe = onSnapshot(postDoc, (postSnapshot) => {
        if (postSnapshot.exists()) {
          runTransaction(this.firestore, async (transaction) => {
            const post = (await transaction.get(postDoc)).data() as IPosts;
  
            // Retrieve the current likedBy array or initialize an empty array
            const currentLikedBy = post.likedBy || [];
  
            // Check if the userId is already in the array
            if (currentLikedBy.includes(userId)) {
              // Remove the userId from the likedBy array (dislike)
              transaction.update(postDoc, {
                likedBy: arrayRemove(userId),
              });
            } else {
              // Add the userId to the likedBy array (like)
              transaction.update(postDoc, {
                likedBy: arrayUnion(userId),
              });
            }
  
            return;
          })
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
              observer.complete();
            });
        } else {
          observer.error('Post not found');
          observer.complete();
        }
      });
  
      // Return an unsubscribe function to clean up the subscription when it's no longer needed
      return () => unsubscribe();
    });
  }

  addUserIdToViewedByRealTime(postId: string, userId: string): Observable<void> {
    const postDoc = doc(this.firestore, 'Posts', postId);
    let hasUpdated = false; // Flag to track whether the update has been processed
  
    return new Observable<void>((observer: Observer<void>) => {
      const unsubscribe = onSnapshot(postDoc, (postSnapshot) => {
        if (postSnapshot.exists() && !hasUpdated) {
          runTransaction(this.firestore, async (transaction) => {
            const post = (await transaction.get(postDoc)).data() as IPosts;
            console.warn("user viewed by: ", post);
  
              transaction.update(postDoc, {
                viewedBy: [...post.viewedBy, userId], // Manually update the viewedBy array
              });
  
              hasUpdated = true; // Set the flag to true after the update
    
          })
          .then(() => {
            observer.next();
            observer.complete();
            unsubscribe(); // Unsubscribe after the first update
          })
          .catch((error) => {
            observer.error(error);
            observer.complete();
          });
        } else {
          observer.error('Post not found or already updated');
          observer.complete();
        }
      });
    });
  }
  
  
  

  getLikedByCount(postId: string, userId: string): Observable<number> {
    const postDoc = doc(this.firestore, 'Posts', postId);
  
    return new Observable<number>((observer) => {
      const unsubscribe = onSnapshot(postDoc, (postSnapshot) => {
        if (postSnapshot.exists()) {
          const post = postSnapshot.data() as IPosts;
  
          // Retrieve the current likedBy array or initialize an empty array
          const currentLikedBy = post.likedBy || [];
  
          // Check if the userId is in the likedBy array
          const isLiked = currentLikedBy.includes(userId);
  
          // Return the count of likedBy
          observer.next(isLiked ? currentLikedBy.length - 1 : currentLikedBy.length); // Subtract 1 if user liked (to exclude own like)
          observer.complete();
        } else {
          observer.error('Post not found');
          observer.complete();
        }
      });
  
      // Return an unsubscribe function to clean up the subscription when it's no longer needed
      return () => unsubscribe();
    });
  }
  

  DeclineFriend(userId: string, friendNumber: string): Observable<void> {
    console.log('user id ', userId);
    console.log('friend number ', friendNumber);
    const usersCollection = 'Users';
    const usersQuery = query(collection(this.firestore, usersCollection), where('phone', '==', friendNumber));
  
    return new Observable<void>((observer: Observer<void>) => {
      const unsubscribe = onSnapshot(usersQuery, async (querySnapshot) => {
        if (querySnapshot.empty) {
          console.log('friend does not exist');
          observer.complete(); // No error, just complete the observer
          return;
        }
  
        const userDoc: DocumentReference<DocumentData> = querySnapshot.docs[0].ref;
        console.log('friend found', userDoc);
  
        // Fetch the current data
        const docSnap = await getDoc(userDoc);
        const userData = docSnap.data();
  
        // Check if 'requests' is an array
        if (Array.isArray(userData?.['requests'])) {
          // Modify the array in your application
          const updatedRequests = userData?.['requests'].filter((request: string) => request !== userId);
  console.warn("updated requests"+updatedRequests)
          // Update the document with the modified array
          console.warn(updatedRequests)
          updateDoc(userDoc, {
            requests: updatedRequests,
          })
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch((error) => {
              console.error('Error removing friend:', error);
              observer.error(error);
            });
        } else {
          // Handle the case where 'requests' is not an array
          console.error('The requests field is not an array.');
          observer.complete();
        }
      });
  
      // Return an unsubscribe function to clean up the subscription when it's no longer needed
      return () => unsubscribe();
    });
  }
  

  async sendMessage(messageData: any): Promise<void> {
    try {
      const messagesCollection = collection(this.firestore, 'Messages');

      // Add the message to the Messages collection
      await addDoc(messagesCollection, {
        ...messageData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // uploadTextStory(userStories: UserStories, text: string, bcolor: string): Observable<void> {
  //   const storiesCollection = collection(this.firestore, 'Stories');
  
  //   return new Observable<void>((observer) => {
  //     addDoc(storiesCollection, {
  //       username: userStories.username,
  //       profile: userStories.profile,
  //       user: userStories.user,
  //       count: userStories.count,
  //       stories: [
  //         {
  //           id: 1,
  //           url: '',
  //           type: 'text',
  //           duration: 6,
  //           isReadMore: false,
  //           storytext: text,
  //           background: bcolor,
  //           storyData: {
  //             uploadedAt: moment().format('DD-MM-YYYY HH:mm:ss'),
  //             viewedBy: [],
  //           },
  //         },
  //       ],
  //     })
  //       .then(() => {
  //         observer.next();
  //         observer.complete();
  //       })
  //       .catch((error) => {
  //         observer.error(error);
  //         observer.complete();
  //       });
  //   });
  // }

  uploadTextStory(userStories: UserStories, text: string, bcolor: string): Observable<void> {
    
    const storiesCollection = collection(this.firestore, 'Stories');
  
    return new Observable<void>((observer) => {
      const userQuery = query(storiesCollection, where('username', '==', userStories.username));
  
      console.log(storiesCollection)
      getDocs(userQuery)
      .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // If the document doesn't exist, create a new one
            addDoc(storiesCollection, {
              username: userStories.username,
              profile: userStories.profile,
              user: userStories.user,
              count: userStories.count,
              stories: [
                {
                  id: 1,
                  url: '',
                  type: 'text',
                  duration: 6,
                  isReadMore: false,
                  storytext: text,
                  background: bcolor,
                  storyData: {
                    uploadedAt: moment().format('DD-MM-YYYY HH:mm:ss'),
                    viewedBy: [],
                  },
                },
              ],
            })
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch((error) => {
                observer.error(error);
                observer.complete();
              });
          } else {
            // If the document exists, update it by adding the new story
            const existingDoc = querySnapshot.docs[0];
            const existingStories = existingDoc.data()['stories'] || [];
            const newStory = {
              id: existingStories.length + 1,
              url: '',
              type: 'text',
              duration: 6,
              isReadMore: false,
              storytext: text,
              background: bcolor,
              storyData: {
                uploadedAt: moment().format('DD-MM-YYYY HH:mm:ss'),
                viewedBy: [],
              },
            };
  
            updateDoc(existingDoc.ref, {
              stories: arrayUnion(newStory),
            })
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch((error) => {
                observer.error(error);
                observer.complete();
              });
          }
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }
  uploadImageStory(userStories: UserStories, images: string[]): Observable<void> {
    const storiesCollection = collection(this.firestore, 'Stories');
  
    return new Observable<void>((observer) => {
      const userQuery = query(storiesCollection, where('username', '==', userStories.username));
  
      getDocs(userQuery)
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // If the document doesn't exist, create a new one
            addDoc(storiesCollection, {
              username: userStories.username,
              profile: userStories.profile,
              user: userStories.user,
              count: userStories.count,
              stories: [
                {
                  id: 1,
                  url: '',
                  type: 'image',
                  duration: 6,
                  isReadMore: false,
                  storyImage: images[0],
                  background: '#000000',
                  storyData: {
                    uploadedAt: moment().format('DD-MM-YYYY HH:mm:ss'),
                    viewedBy: [],
                  },
                },
              ],
            })
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch((error) => {
                observer.error(error);
                observer.complete();
              });
          } else {
            // If the document exists, update it by adding the new story
            const existingDoc = querySnapshot.docs[0];
            const existingStories = existingDoc.data()['stories'] || [];
            const newStory = {
              id: existingStories.length + 1,
              url: '',
              type: 'image',
              duration: 6,
              isReadMore: false,
              storyImage: images[0],
              background: '#000000',
              storyData: {
                uploadedAt: moment().format('DD-MM-YYYY HH:mm:ss'),
                viewedBy: [],
              },
            };
  
            updateDoc(existingDoc.ref, {
              stories: arrayUnion(newStory),
            })
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch((error) => {
                observer.error(error);
                observer.complete();
              });
          }
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  getAllStories(): Observable<UserStories[]> {
    const storiesCollection = collection(this.firestore, 'Stories');
    const storiesQuery = query(storiesCollection);

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(storiesQuery, (querySnapshot) => {
        const userStoriesList: UserStories[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const userStories: UserStories = {
            username: data['username'],
            profile: data['profile'],
            user: data['user'],
            count: data['count'],
            stories: data['stories'],
          };
          userStoriesList.push(userStories);
        });

        observer.next(userStoriesList);
      }, (error) => {
        observer.error(error);
      });

      // Return an unsubscribe function to clean up the subscription
      return () => unsubscribe();
    });
  }

  generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  
  async uploadPicture(imageString:string):Promise<string> {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2);
    const filename = `/guestProfile/profilePicture_${timestamp}_${randomString}.png`;
  
    const storageRef = ref(this.storage, filename);
  
    const uploadedPicture = await uploadString(storageRef, imageString, 'base64');
  
    const downloadUrl = getDownloadURL(storageRef);
    return downloadUrl;
  }

  updateduserprofile(currentUserNumber:string,image:string) {
    const usersCollection = 'Users';
    const queryRef = query(collection(this.firestore, usersCollection), where('phone', '==', currentUserNumber));
    
    return new Observable<void>((observer: Observer<void>) => {
      from(getDocs(queryRef)).pipe(
        switchMap((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log('current user does not exist')
            // Friend not found
            // You can handle this case differently, like showing an error message.
            observer.complete(); // No error, just complete the observer
            return throwError('current user not found');
          } else {
            // Friend found
            console.warn("called")
            const userDoc: DocumentReference<DocumentData> = querySnapshot.docs[0].ref;
            console.log('current user found',userDoc)
            // Update the friend's requests array
            return from(updateDoc(userDoc, {
              image: image,
            }));
          }
        }),
        catchError((error) => {
          console.error('Error adding friend:', error);
          observer.error(error);
          return throwError(error);
        })
      ).subscribe(
        () => {
          observer.next();
          observer.complete();
        }
      );
    });
  }

  favoriteComment(postId: string, commentId: string, userId: string, commentFromUser: any): Observable<void> {
    const postDoc = doc(this.firestore, 'Posts', postId);
  
    return from(getDoc(postDoc)).pipe(
      switchMap((postSnapshot) => {
        if (postSnapshot.exists()) {
          const post = postSnapshot.data() as IPosts;
          const currentComments = post.comments || [];
          const updatedComments = currentComments.map((comment: any) => {
            console.log(comment, commentFromUser);
            if (comment.comment === commentFromUser.username.comment) {
              // Check if userId exists in likes array
              const existingIndex = (comment.likes || []).indexOf(userId);
              
              if (existingIndex !== -1) {
                // If userId exists, remove it from likes array
                const updatedLikes = [...comment.likes.slice(0, existingIndex), ...comment.likes.slice(existingIndex + 1)];
                return { ...comment, likes: updatedLikes, commentId: commentId };
              } else {
                // If userId doesn't exist, add it to likes array
                const updatedLikes = [...(comment.likes || []), userId];
                return { ...comment, likes: updatedLikes, commentId: commentId };
              }
            }
            return comment;
          });
  
          return from(updateDoc(postDoc, { comments: updatedComments })).pipe(
            map(() => undefined),
            catchError((error) => {
              throw error;
            })
          );
        } else {
          throw new Error('Post not found');
        }
      }),
      catchError((error) => {
        throw error;
      })
    );
  }
  
  
  deleteOldStories(): void {
    const storiesCollection = collection(this.firestore, 'Stories');
    const storiesQuery = query(storiesCollection);

    onSnapshot(storiesQuery, (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        console.log("stories here ",data)
        const stories: Story[] = data['stories'];

        // Filter out stories older than 24 hours
        const filteredStories = stories.filter((story) => this.isStoryWithin24Hours(story));

        if (filteredStories.length > 0) {
          // Update the document with the filtered stories
          await updateDoc(doc.ref, { stories: filteredStories });
        } else {
          // If stories array is empty, delete the entire document
          await deleteDoc(doc.ref);
        }
      });
    });
  }

  // Helper function to check if a story is within 24 hours
  isStoryWithin24Hours(story: Story): boolean {
    const currentTime = new Date().getTime();
    const storyTime = new Date(story.storyData.uploadedAt).getTime();
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

    return currentTime - storyTime <= twentyFourHoursInMs;
  }
}

