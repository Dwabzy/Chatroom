import { Component, OnInit } from '@angular/core';
import { ChatroomService } from 'src/app/services/chatroom.service';

@Component({
  selector: 'chatroom-stats',
  templateUrl: './chatroom-stats.component.html',
  styleUrls: ['./chatroom-stats.component.scss']
})
export class ChatroomStatsComponent implements OnInit {

  visitorDetails: Array<any> = [];
  visitorChat: Array<any> = [];
  constructor(private chatroomService: ChatroomService) { }

  ngOnInit(): void {
    this.chatroomService.getVisitorDetails().subscribe(
      (res: any) => {
        let { visitorDetails, visitorChat } = JSON.parse(JSON.stringify(res));
        this.visitorDetails = visitorDetails;
        this.visitorChat = visitorChat;
        console.log(this.visitorDetails, this.visitorChat);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
