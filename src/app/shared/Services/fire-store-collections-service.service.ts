import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    public userAuth: Auth) { }


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

}
