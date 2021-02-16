import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss']
})
export class VisitorsComponent implements OnInit {

  @Input() visitorList: Array<any> = [];

  
  constructor(private router: Router, private webSocketService: WebSocketService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.webSocketService.emit('get-unconnected-visitors-request', "");
    this.webSocketService.listen('receive-unconnected-visitors-list').subscribe((data: any) => {
      this.visitorList = data;
      console.log(data);
    })
    this.webSocketService.listen('visitor-details').subscribe((data: any) => {
      let visitor = this.visitorList.find(visitorChat => visitorChat.visitorId === data.visitorId);
      console.log(visitor);
      // If visitor is not part of the existing visitor list, push it into the list.
      if(!this.visitorList.includes(visitor))
        this.visitorList.push(data);
    })
  }

  connectToVisitor = (visitor: any): void => {
    let { visitorId, visitorName, chatroomName, messages } = visitor;
    let username = this.activatedRoute.snapshot.params.username;

    // Removed assigned Visitor from visitorList.
    let indexOfVisitor = this.visitorList.indexOf(visitor);
    this.visitorList.splice(indexOfVisitor, 1);

    // Emit details along with username to assign-agent.
    this.webSocketService.emit('assign-agent', {username, visitorId, visitorName, chatroomName, messages})
  }

}
