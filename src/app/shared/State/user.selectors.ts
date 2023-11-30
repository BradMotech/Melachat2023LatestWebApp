// user.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(selectUserState, (state) => state.currentUser);

export const selectDocId = createSelector(
    selectUserState,
    (state) => state.docId
  );