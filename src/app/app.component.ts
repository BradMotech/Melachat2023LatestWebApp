import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setCurrentUser, setDocId } from './shared/State/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '2023MelaChatWebApp';

  constructor(private store: Store) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    const storedUserId = localStorage.getItem('userId');
    console.log("local storage stored id ",storedUserId)
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.store.dispatch(setCurrentUser({ user }));
      this.store.dispatch(setDocId({ docId:storedUserId as string }));
    }
  }
}
