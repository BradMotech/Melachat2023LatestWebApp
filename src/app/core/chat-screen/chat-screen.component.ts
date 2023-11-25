import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsersInterface } from 'src/app/shared/Interfaces/IUsersInterface';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss']
})
export class ChatScreenComponent implements OnInit {
 
  friendData:IUsersInterface | undefined;

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const friendDataString = params['friendData'];
      if (friendDataString) {
        this.friendData = JSON.parse(friendDataString);
      }
    });
  }

navigateBack(){
  this.router.navigate(['/', 'home'])
}
}
