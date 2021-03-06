import { Component, OnInit } from '@angular/core';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'chatroom-stats',
  templateUrl: './chatroom-stats.component.html',
  styleUrls: ['./chatroom-stats.component.scss']
})
export class ChatroomStatsComponent implements OnInit {

  visitorDetails: Array<any> = [];
  visitorChat: Array<any> = [];
  constructor(private chatroomService: ChatroomService, public timeService: TimeService) { }

  ngOnInit(): void {
    this.chatroomService.getVisitorDetails().subscribe(
      (res: any) => {
        this.visitorDetails = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  viewChat = (visitorId: any): void => {
    console.log(visitorId);
    this.chatroomService.viewChat(visitorId).subscribe(
      (res: any) => {
        this.visitorChat = res;
        console.log(this.visitorChat);
      }
    )
  }

}
