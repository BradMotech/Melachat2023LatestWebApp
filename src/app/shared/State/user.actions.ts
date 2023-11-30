// user.actions.ts
import { createAction, props } from '@ngrx/store';
import { IUsersInterface } from '../Interfaces/IUsersInterface';

export const loadUserData = createAction('[User] Load User Data');
export const setCurrentUser = createAction('[User] Set Current User', props<{ user: IUsersInterface }>());
export const setDocId = createAction('[User] Set Doc ID', props<{ docId: string }>());
