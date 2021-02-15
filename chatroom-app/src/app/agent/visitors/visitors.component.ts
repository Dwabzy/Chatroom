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


    this.webSocketService.listen('send-unconnnected-visitors').subscribe((data: any) => {
      this.visitorList = data;
    })

    this.webSocketService.listen('visitor-details').subscribe((data: any) => {
      data.visitorId = data.visitorName.slice(-4);
      let visitor = this.visitorList.find(visitorChat => visitorChat.visitorId === data.visitorId);
      if(!visitor)
        this.visitorList.push(data);
      else {
        let index = this.visitorList.indexOf(visitor);
        this.visitorList[index].visitorSocketId = data.visitorSocketId;
        
      }
    })

    
  }

  connectToVisitor = (visitorId: string, visitorSocketId: string): void => {
    let username = this.activatedRoute.snapshot.params.username;
    let agentSocketId = this.webSocketService.socket.id;
    this.webSocketService.emit('connect-to-visitor', { username, visitorId, visitorSocketId, agentSocketId })

    this.router.navigateByUrl(`/agent-dashboard/${username}/chat`)
  }

}
