import { Component, OnInit } from '@angular/core';
import { ChatroomService } from 'src/app/services/chatroom.service';

@Component({
  selector: 'display-chatrooms',
  templateUrl: './display-chatrooms.component.html',
  styleUrls: ['./display-chatrooms.component.scss']
})
export class DisplayChatroomsComponent implements OnInit {
  myChatrooms: any;
  myChatroomsTheme: Array<any> = [];

  constructor(public chatroomService: ChatroomService) { }

  ngOnInit(): void {
    this.chatroomService.displayChatrooms().subscribe(
      (res: any) => {
        this.myChatrooms = JSON.parse(JSON.stringify(res));
        console.log(this.myChatrooms);
        for (let i = 0; i < this.myChatrooms.length; i++)
          this.myChatroomsTheme.push(JSON.parse(this.myChatrooms[i].chatbox_theme));
        console.log(this.myChatroomsTheme[0]);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}