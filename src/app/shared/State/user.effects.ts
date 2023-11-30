// user.effects.ts
import { Injectable, Inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { loadUserData, setCurrentUser, signInWithPhoneNumberFailure } from './user.actions';
import { FireStoreCollectionsServiceService } from '../Services/fire-store-collections-service.service';
import { IUsersInterface } from '../Interfaces/IUsersInterface';

@Injectable()
export class UserEffects {
  constructor(
    @Inject(Actions) private actions$: Actions,
    private fireStoreService: FireStoreCollectionsServiceService
  ) {}

  signInWithPhoneNumber$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserData),
      mergeMap((action) =>
        this.fireStoreService.signInWithPhoneNumber(action.phoneNumber, action.password).then(
          (userData) => {
            localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
            return setCurrentUser({ user: userData as IUsersInterface });
          },
          (error) => of(null)
        )
      )
    )
  );
