// user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { setCurrentUser, setDocId } from './user.actions';
import { IUsersInterface } from '../Interfaces/IUsersInterface';

export interface UserState {
  currentUser: IUsersInterface | null;
  docId: string | null;
}

export const initialState: UserState = {
  currentUser: null,
  docId:null
};

export const userReducer = createReducer(
  initialState,
  on(setCurrentUser, (state, { user }) => ({ ...state, currentUser: user })),
  on(setDocId, (state, { docId }) => ({ ...state, docId })),
);
